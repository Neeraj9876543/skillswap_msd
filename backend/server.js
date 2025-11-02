const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    env: process.env.NODE_ENV || "development", 
    port: PORT,
    timestamp: new Date().toISOString()
  });
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

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
