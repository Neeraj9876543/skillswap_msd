const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find({}, {
      name: 1,
      rating: 1,
      sessions: 1,
      skills: 1,
      user: 1,
      image: 1,
    }).lean();
    const result = [];
    for (const p of profiles) {
      const teacher = p.name || "User";
      const rating = typeof p.rating !== "undefined" ? String(p.rating) : "4.9";
      const sessions = typeof p.sessions !== "undefined" ? String(p.sessions) : "0";
      let avatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(teacher)}`;
      if (p.image) {
        if (typeof p.image === "string" && p.image.startsWith("/uploads/")) {
          avatar = `http://localhost:5000${p.image}`;
        } else if (typeof p.image === "string") {
          avatar = p.image;
        }
      }
      for (const s of (p.skills || [])) {
        result.push({
          externalProfileId: String(p.user || ""),
          externalSkillId: String(s._id),
          id: `pub_${p.user || ""}_${s._id}`,
          title: s.title,
          category: s.category,
          level: s.level,
          desc: s.description,
          teacher,
          avatar,
          rating,
          sessions,
          rate: Number(s.credits || 0),
        });
      }
    }
    res.json({ skills: result });
  } catch (err) {
    console.error("[skills] GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
