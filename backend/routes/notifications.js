const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
router.get("/", protect, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({ path: "sender", select: "name email _id" })
      .lean();
    res.json({ notifications: list });
  } catch (err) {
    console.error("[notifications] GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", protect, async (req, res) => {
  try {
    const { receiverUserId, type = "request", message, meta = {} } = req.body || {};
    if (!receiverUserId || !message) {
      return res.status(400).json({ message: "receiverUserId and message are required" });
    }
    const created = await Notification.create({
      user: receiverUserId,
      sender: req.user._id,
      type,
      message,
      meta: { ...(meta || {}), senderName: req.user.name, senderEmail: req.user.email },
    });
    res.status(201).json({ notification: created });
  } catch (err) {
    console.error("[notifications] POST error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification: updated });
  } catch (err) {
    console.error("[notifications] PATCH error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:id/accept", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: req.user._id });
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    if (notif.type !== "request") return res.status(400).json({ message: "Only request notifications can be accepted" });
    notif.meta = { ...(notif.meta || {}), accepted: true };
    notif.read = true;
    await notif.save();
    try {
      await Notification.create({
        user: notif.sender,
        sender: req.user._id,
        type: "system",
        message: "accepted your request.",
        meta: { sourceNotificationId: notif._id },
      });
    } catch (e) {
      console.warn("[notifications] Failed to create acceptance notification:", e?.message || e);
    }
    const populated = await Notification.findById(notif._id)
      .populate({ path: "sender", select: "name _id" })
      .lean();
    res.json({ notification: populated });
  } catch (err) {
    console.error("[notifications] ACCEPT error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
