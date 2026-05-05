import express from "express";
import requireAdminAuth from "../middleware/requireAdminAuth.js";
import pool from "../db/pool.js";
import {
  requestUpdatesTotal,
  requestNotesAddedTotal,
} from "../metrics/metricsRegistry.js";
const router = express.Router();

router.get("/requests", requireAdminAuth, async (req, res) => {
  try {
    const { status = "all" } = req.query;

    let query = `
      SELECT
        pr.id,
        pr.provider_id,
        u.display_name,
        pr.title,
        pr.status,
        pr.created_at,
        pr.updated_at
      FROM provider_requests pr
      JOIN users u
        ON u.id = pr.provider_id
    `;

    const values = [];

    if (status === "closed") {
      query += ` WHERE pr.status = $1 `;
      values.push("closed");
    } else if (status !== "all") {
      query += ` WHERE pr.status = $1 AND pr.status <> 'closed' `;
      values.push(status);
    } else {
      query += ` WHERE pr.status <> 'closed' `;
    }

    query += ` ORDER BY pr.created_at DESC `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      message: "Requests fetched successfully",
      requests: result.rows,
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
        pr.id,
        pr.provider_id,
        u.display_name,
        u.email,
        pr.title,
        pr.description,
        pr.status,
        pr.admin_note,
        pr.created_at,
        pr.updated_at,
        pr.completed_at
      FROM provider_requests pr
      JOIN users u
        ON u.id = pr.provider_id
      WHERE pr.id = $1
      `,
      [id]
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
        user_type,
        user_id,
        note,
        created_at
      FROM request_notes
      WHERE request_id = $1
      ORDER BY created_at ASC
      `,
      [id]
    );

    return res.status(200).json({
      message: "Request fetched successfully",
      request: requestResult.rows[0],
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

    const completedAt = status === "complete" ? "NOW()" : "NULL";

    const result = await pool.query(
      `
      UPDATE provider_requests
      SET
        status = $1,
        
        updated_at = NOW(),
        completed_at = ${completedAt},
        completed_by_admin_id = CASE
          WHEN $1 = 'complete' THEN $2::uuid
          ELSE NULL
        END
      WHERE id = $3
      RETURNING *
      `,
      [status, req.session.admin.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    requestUpdatesTotal.inc();

    return res.status(200).json({
      message: "Request updated successfully",
      request: result.rows[0],
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
      `SELECT id FROM provider_requests WHERE id = $1`,
      [id]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO request_notes (request_id, user_type, user_id, note)
      VALUES ($1, 'admin', $2, $3)
      RETURNING *
      `,
      [id, req.session.admin.id, note.trim()]
      
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