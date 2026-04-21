import express from "express";
import requireAdminAuth from "../middleware/requireAdminAuth.js";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/providers", requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        display_name,
        email,
        phone,
        city,
        status,
        created_at
      FROM users
      WHERE role = 'provider'
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      message: "Providers fetched successfully",
      providers: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch providers",
      error: error.message,
    });
  }
});

export default router;