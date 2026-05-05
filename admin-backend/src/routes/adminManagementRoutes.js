import express from "express";
import bcrypt from "bcrypt";
import requireRootAdmin from "../middleware/requireRootAdmin.js";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/admins", requireRootAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM admin_users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      message: "Admins fetched successfully",
      admins: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
});

router.post("/admins", requireRootAdmin, async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingAdmin = await pool.query(
      `SELECT id FROM admin_users WHERE email = $1`,
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(409).json({
        message: "An admin with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO admin_users (
        full_name,
        email,
        password_hash,
        role,
        is_active
      )
      VALUES ($1, $2, $3, 'admin', true)
      RETURNING id, full_name, email, role, is_active, created_at, updated_at
      `,
      [full_name, email, passwordHash]
    );

    return res.status(201).json({
      message: "Admin created successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
});

export default router;