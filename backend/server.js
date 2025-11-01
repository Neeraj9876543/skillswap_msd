const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development", port: PORT });
});
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const favoritesRoutes = require("./routes/favorites");
const skillsRoutes = require("./routes/skills");
const notificationsRoutes = require("./routes/notifications");
const sessionsRoutes = require("./routes/sessions");
const messagesRoutes = require("./routes/messages");
const contactRoutes = require("./routes/contact");
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/contact", contactRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`[backend] Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
