const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    externalId: { type: String, required: true }, // matches card id (string)
    title: { type: String, required: true },
    category: { type: String, default: "" },
    level: { type: String, default: "" },
    desc: { type: String, default: "" },
    teacher: { type: String, default: "" },
    avatar: { type: String, default: "" },
    rating: { type: String, default: "" },
    sessions: { type: String, default: "" },
    rate: { type: Number, default: 0 },
  },
  { timestamps: true }
);
favoriteSchema.index({ user: 1, externalId: 1 }, { unique: true });
module.exports = mongoose.model("Favorite", favoriteSchema);
