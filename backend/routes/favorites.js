const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Favorite = require("../models/Favorite");
router.get("/", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ favorites });
  } catch (err) {
    console.error("[favorites] GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", protect, async (req, res) => {
  try {
    const {
      externalId,
      title,
      category = "",
      level = "",
      desc = "",
      teacher = "",
      avatar = "",
      rating = "",
      sessions = "",
      rate = 0,
    } = req.body || {};

    if (!externalId || !title) {
      return res.status(400).json({ message: "externalId and title are required" });
    }
    const payload = {
      user: req.user._id,
      externalId: String(externalId),
      title,
      category,
      level,
      desc,
      teacher,
      avatar,
      rating,
      sessions,
      rate,
    };
    await Favorite.findOneAndUpdate(
      { user: req.user._id, externalId: String(externalId) },
      { $set: payload },
      { upsert: true, new: true }
    );
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.status(201).json({ favorites });
  } catch (err) {
    console.error("[favorites] POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:externalId", protect, async (req, res) => {
  try {
    const { externalId } = req.params;
    const del = await Favorite.findOneAndDelete({ user: req.user._id, externalId: String(externalId) });
    if (!del) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ favorites });
  } catch (err) {
    console.error("[favorites] DELETE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
