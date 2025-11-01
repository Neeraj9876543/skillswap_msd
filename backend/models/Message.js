const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    conversation: { type: String, index: true }, // stable code: min(from,to)_max(from,to)
    attachmentType: { type: String, enum: ["photo", "video", "document", null], default: null },
    attachments: [
      {
        originalName: String,
        filename: String,
        url: String,
        mimetype: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);
MessageSchema.index({ from: 1, to: 1, createdAt: 1 });
module.exports = mongoose.model("Message", MessageSchema);
