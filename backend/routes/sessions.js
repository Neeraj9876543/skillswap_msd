const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Session = require("../models/Session");
router.use((req, res, next) => {
  console.log(`[sessions router] ${req.method} ${req.originalUrl}`);
  next();
});
router.post("/", protect, async (req, res) => {
  try {
    const { mode, topic, fromWhom, startAt, durationMinutes } = req.body;

    if (!mode || !topic || !fromWhom || !startAt || !durationMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["Learning", "Teaching"].includes(mode)) {
      return res.status(400).json({ message: "mode must be 'Learning' or 'Teaching'" });
    }
    const session = await Session.create({
      mode,
      topic: String(topic).trim(),
      fromWhom: String(fromWhom).trim(),
      startAt: new Date(startAt),
      durationMinutes: Number(durationMinutes),
      createdBy: req.user._id,
    });
    res.status(201).json(session);
  } catch (err) {
    console.error("POST /api/sessions error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", protect, async (req, res) => {
  try {
    const sessions = await Session.find({}).sort({ startAt: 1, createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("GET /api/sessions error", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
