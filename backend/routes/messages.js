const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
router.use((req, res, next) => {
  console.log(`[messages router] ${req.method} ${req.originalUrl}`);
  next();
});
router.post("/", protect, async (req, res) => {
  try {
    const { to, text } = req.body || {};
    if (!to || !text || !String(text).trim()) {
      return res.status(400).json({ message: "to and text are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ message: "Invalid recipient id" });
    }
    const fromId = String(req.user._id);
    const toId = String(to);
    const minId = fromId < toId ? fromId : toId;
    const maxId = fromId < toId ? toId : fromId;
    const conversation = `${minId}_${maxId}`;
    const created = await Message.create({ from: req.user._id, to, text: String(text).trim(), conversation });
    res.status(201).json({ message: created });
  } catch (err) {
    console.error("[messages] POST error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", protect, async (req, res) => {
  try {
    const otherId = req.query.with;
    if (!otherId) {
      return res.status(400).json({ message: "query 'with' is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(otherId)) {
      return res.json({ messages: [] });
    }
    const myId = req.user._id;
    const convo = await Message.find({
      $or: [
        { from: myId, to: otherId },
        { from: otherId, to: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ messages: convo });
  } catch (err) {
    console.error("[messages] GET error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/by/:code", protect, async (req, res) => {
  try {
    const code = req.params.code;
    if (!code || typeof code !== "string") return res.status(400).json({ message: "code is required" });
    let messages = await Message.find({ conversation: code }).sort({ createdAt: 1 }).lean();
    if (!messages || messages.length === 0) {
      const parts = String(code).split("_");
      if (parts.length === 2 && mongoose.Types.ObjectId.isValid(parts[0]) && mongoose.Types.ObjectId.isValid(parts[1])) {
        const [a, b] = parts;
        messages = await Message.find({
          $or: [
            { from: a, to: b },
            { from: b, to: a },
          ],
        })
          .sort({ createdAt: 1 })
          .lean();
      }
    }
    res.json({ messages });
  } catch (err) {
    console.error("[messages] GET by code error", err);
    res.status(500).json({ message: "Server error" });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const to = req.body?.to;
      if (!to || !mongoose.Types.ObjectId.isValid(to)) return cb(new Error("Invalid recipient id"));
      const fromId = String(req.user._id);
      const toId = String(to);
      const minId = fromId < toId ? fromId : toId;
      const maxId = fromId < toId ? toId : fromId;
      const code = `${minId}_${maxId}`;
      const dir = path.join(__dirname, "..", "uploads", "messages", code);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = String(file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}_${safe}`);
  },
});
const upload = multer({ storage });
router.post("/upload", protect, upload.array("files", 10), async (req, res) => {
  try {
    const { to, type } = req.body || {};
    if (!to || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ message: "Invalid recipient id" });
    }
    if (!type || !["photo", "video", "document"].includes(type)) {
      return res.status(400).json({ message: "Invalid attachment type" });
    }
    const files = Array.isArray(req.files) ? req.files : [];
    if (!files.length) return res.status(400).json({ message: "No files uploaded" });
    const fromId = String(req.user._id);
    const toId = String(to);
    const minId = fromId < toId ? fromId : toId;
    const maxId = fromId < toId ? toId : fromId;
    const conversation = `${minId}_${maxId}`;
    const attachments = files.map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      url: `/uploads/messages/${conversation}/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size,
    }));
    const names = files.map((f) => f.originalname).join(", ");
    const plural = files.length > 1 ? "s" : "";
    const text = names ? `Shared ${type}${plural}: ${names}` : `Shared ${type}`;
    const created = await Message.create({
      from: req.user._id,
      to,
      text,
      conversation,
      attachmentType: type,
      attachments,
    });
    res.status(201).json({ message: created });
  } catch (err) {
    console.error("[messages] UPLOAD error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/conversations", protect, async (req, res) => {
  try {
    const myId = req.user._id;
    const pipeline = [
      { $match: { $or: [{ from: myId }, { to: myId }] } },
      {
        $addFields: {
          other: {
            $cond: [{ $eq: ["$from", myId] }, "$to", "$from"],
          },
        },
      },
      {
        $addFields: {
          fromStr: { $toString: "$from" },
          toStr: { $toString: "$to" },
        },
      },
      {
        $addFields: {
          minId: { $cond: [{ $lt: ["$fromStr", "$toStr"] }, "$fromStr", "$toStr"] },
          maxId: { $cond: [{ $lt: ["$fromStr", "$toStr"] }, "$toStr", "$fromStr"] },
        },
      },
      {
        $addFields: {
          code: { $concat: ["$minId", "_", "$maxId"] },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$other",
          lastAt: { $last: "$createdAt" },
          lastText: { $last: "$text" },
          lastFrom: { $last: "$from" },
          total: { $sum: 1 },
          code: { $last: "$code" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          name: { $ifNull: ["$profile.name", { $ifNull: ["$user.username", "User"] }] },
          lastMessage: "$lastText",
          lastAt: 1,
          code: 1,
          image: "$profile.image",
        },
      },
      { $sort: { lastAt: -1 } },
    ];
    const results = await Message.aggregate(pipeline);
    const conversations = results.map((r) => {
      let avatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(r.name || "User")}`;
      if (r.image) {
        if (typeof r.image === "string" && r.image.startsWith("/uploads/")) {
          avatar = `http://localhost:5000${r.image}`;
        } else if (typeof r.image === "string") {
          avatar = r.image;
        }
      }
      return {
        id: String(r.userId),
        name: r.name || "User",
        img: avatar,
        lastMessage: r.lastMessage || "",
        lastAt: r.lastAt,
        code: r.code,
      };
    });
    res.json({ conversations });
  } catch (err) {
    console.error("[messages] GET /conversations error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
