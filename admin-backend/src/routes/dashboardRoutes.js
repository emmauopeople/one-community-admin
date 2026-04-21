import express from "express";
import requireAdminAuth from "../middleware/requireAdminAuth.js";

const router = express.Router();

router.get("/dashboard/summary", requireAdminAuth, async (req, res) => {
  return res.status(200).json({
    message: "Dashboard summary fetched successfully",
    stats: {
      totalProviders: 0,
      activeProviders: 0,
      totalSkills: 0,
      openRequests: 0,
    },
    admin: req.session.admin,
  });
});

export default router;