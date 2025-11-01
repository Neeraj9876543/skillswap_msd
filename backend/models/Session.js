const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["Learning", "Teaching"],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    fromWhom: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 24 * 60 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Session", SessionSchema);
