const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  credits: { type: Number, required: true, min: 0 },
}, { _id: true });
const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  image: { type: String, default: "download.jpg" },
  rating: { type: Number, default: 4.9 },
  sessions: { type: Number, default: 47 },
  credits: { type: Number, default: 85 },
  skills: { type: [skillSchema], default: [] },
  interests: { type: [String], default: [] },
  favorites: {
    type: [new mongoose.Schema({
      externalId: { type: String, required: true },
      title: { type: String, required: true },
      category: { type: String, default: "" },
      level: { type: String, default: "" },
      desc: { type: String, default: "" },
      teacher: { type: String, default: "" },
      avatar: { type: String, default: "" },
      rating: { type: String, default: "" },
      sessions: { type: String, default: "" },
      rate: { type: Number, default: 0 },
    }, { _id: false })],
    default: [],
  },
}, { timestamps: true });
module.exports = mongoose.model("Profile", profileSchema);
