const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Profile = require("../models/Profile");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    const user = await User.findById(userId);
    profile = await Profile.create({ user: userId, name: user?.name || "" });
  }
  return profile;
}
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const safeName = `${req.user._id}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});
router.post("/image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const profile = await getOrCreateProfile(req.user._id);
    profile.image = imageUrl;
    await profile.save();
    res.status(201).json({ image: imageUrl, profile });
  } catch (err) {
    console.error("POST /api/profile/image error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/me", protect, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    res.json(profile);
  } catch (err) {
    console.error("GET /api/profile/me error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/", protect, async (req, res) => {
  try {
    const allowed = ["name", "location", "bio", "image", "rating", "sessions", "credits"]; 
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const profile = await getOrCreateProfile(req.user._id);
    Object.assign(profile, updates);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("PUT /api/profile error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/skills", protect, async (req, res) => {
  try {
    const { title, category, level, description, credits } = req.body;
    if (!title || !category || !level || !description || credits === undefined) {
      return res.status(400).json({ message: "Missing required skill fields" });
    }
    const profile = await getOrCreateProfile(req.user._id);
    profile.skills.push({ title, category, level, description, credits: Number(credits) });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("POST /api/profile/skills error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/skills/:skillId", protect, async (req, res) => {
  try {
    const { skillId } = req.params;
    const profile = await getOrCreateProfile(req.user._id);
    const initialLen = profile.skills.length;
    profile.skills = profile.skills.filter((s) => s._id.toString() !== skillId);
    if (profile.skills.length === initialLen) {
      return res.status(404).json({ message: "Skill not found" });
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("DELETE /api/profile/skills/:skillId error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/interests", protect, async (req, res) => {
  try {
    const { interest } = req.body;
    if (!interest || !interest.trim()) {
      return res.status(400).json({ message: "Interest is required" });
    }
    const profile = await getOrCreateProfile(req.user._id);
    profile.interests.push(interest.trim());
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("POST /api/profile/interests error", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/interests", protect, async (req, res) => {
  try {
    const { interest } = req.body;
    if (!interest) return res.status(400).json({ message: "Interest is required" });
    const profile = await getOrCreateProfile(req.user._id);
    const initialLen = profile.interests.length;
    profile.interests = profile.interests.filter((i) => i !== interest);
    if (profile.interests.length === initialLen) {
      return res.status(404).json({ message: "Interest not found" });
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("DELETE /api/profile/interests error", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
