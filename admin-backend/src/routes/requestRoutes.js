import express from "express";
import requireAdminAuth from "../middleware/requireAdminAuth.js";
import pool from "../db/pool.js";
import {
  requestUpdatesTotal,
  requestNotesAddedTotal,
} from "../metrics/metricsRegistry.js";

const router = express.Router();

const uiToDbStatus = {
  incomplete: "incomplete",
  "in-progress": "in_progress",
  complete: "completed",
  closed: "closed",
  denied: "denied",
};

const dbToUiStatus = {
  incomplete: "incomplete",
  in_progress: "in-progress",
  completed: "complete",
  closed: "closed",
  denied: "denied",
};

function toUiStatus(status) {
  return dbToUiStatus[status] || status;
}

function toDbStatus(status) {
  return uiToDbStatus[status] || status;
}

router.get("/requests", requireAdminAuth, async (req, res) => {
  try {
    const { status = "all" } = req.query;

    let sql = `
      SELECT
        sr.id,
        sr.requester_user_id AS provider_id,
        sr.requester_name AS display_name,
        sr.subject AS title,
        sr.status,
        sr.created_at,
        sr.updated_at
      FROM support_requests sr
      WHERE sr.requester_type = 'provider'
    `;

    const values = [];

    if (status === "closed") {
      sql += ` AND sr.status = $1 `;
      values.push("closed");
    } else if (status !== "all") {
      sql += ` AND sr.status = $1 AND sr.status <> 'closed' `;
      values.push(toDbStatus(status));
    } else {
      sql += ` AND sr.status <> 'closed' `;
    }

    sql += ` ORDER BY sr.created_at DESC `;

    const result = await pool.query(sql, values);

    const requests = result.rows.map((row) => ({
      ...row,
      status: toUiStatus(row.status),
    }));

    return res.status(200).json({
      message: "Requests fetched successfully",
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

router.get("/requests/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const requestResult = await pool.query(
      `
      SELECT
        sr.id,
        sr.requester_user_id AS provider_id,
        sr.requester_name AS display_name,
        sr.requester_email AS email,
        sr.subject AS title,
        sr.description,
        sr.status,
        NULL::text AS admin_note,
        sr.created_at,
        sr.updated_at,
        sr.closed_at AS completed_at
      FROM support_requests sr
      WHERE sr.id = $1
        AND sr.requester_type = 'provider'
      `,
      [id],
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const notesResult = await pool.query(
      `
      SELECT
        id,
        request_id,
        sender_type AS user_type,
        sender_user_id AS user_id,
        message AS note,
        created_at
      FROM support_request_messages
      WHERE request_id = $1
        AND is_internal = FALSE
      ORDER BY created_at ASC, id ASC
      `,
      [id],
    );

    const request = {
      ...requestResult.rows[0],
      status: toUiStatus(requestResult.rows[0].status),
    };

    return res.status(200).json({
      message: "Request fetched successfully",
      request,
      notes: notesResult.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch request",
      error: error.message,
    });
  }
});

router.patch("/requests/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "incomplete",
      "complete",
      "in-progress",
      "closed",
      "denied",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const dbStatus = toDbStatus(status);
    const closedAt = dbStatus === "completed" || dbStatus === "closed" ? "NOW()" : "NULL";

    const result = await pool.query(
      `
      UPDATE support_requests
      SET
        status = $1,
        updated_at = NOW(),
        closed_at = ${closedAt}
      WHERE id = $2
        AND requester_type = 'provider'
      RETURNING *
      `,
      [dbStatus, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    requestUpdatesTotal.inc();

    return res.status(200).json({
      message: "Request updated successfully",
      request: {
        ...result.rows[0],
        provider_id: result.rows[0].requester_user_id,
        display_name: result.rows[0].requester_name,
        email: result.rows[0].requester_email,
        title: result.rows[0].subject,
        status: toUiStatus(result.rows[0].status),
        completed_at: result.rows[0].closed_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
});

router.post("/requests/:id/notes", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        message: "Note is required",
      });
    }

    const requestCheck = await pool.query(
      `
      SELECT id
      FROM support_requests
      WHERE id = $1
        AND requester_type = 'provider'
      `,
      [id],
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO support_request_messages
        (request_id, sender_type, sender_user_id, sender_name, sender_email, message, is_internal)
      VALUES
        ($1, 'admin', NULL, 'Admin', NULL, $2, FALSE)
      RETURNING
        id,
        request_id,
        sender_type AS user_type,
        sender_user_id AS user_id,
        message AS note,
        created_at
      `,
      [id, note.trim()],
    );

    await pool.query(
      `
      UPDATE support_requests
      SET updated_at = NOW(),
          last_message_at = NOW()
      WHERE id = $1
      `,
      [id],
    );

    requestNotesAddedTotal.inc();

    return res.status(201).json({
      message: "Note added successfully",
      note: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add note",
      error: error.message,
    });
  }
});

export default router;