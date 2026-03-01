/**
 * server.js
 * Entry point for the SHFCD API server.
 * Starts Express, connects to MongoDB, registers routes.
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const riskRoutes = require("./routes/riskRoutes");

const app = express();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api", riskRoutes);

// ── Health check ──
app.get("/api/health", (req, res) =>
    res.status(200).json({ success: true, message: "SHFCD API is running." })
);

// ── 404 handler ──
app.use((req, res) =>
    res.status(404).json({ success: false, message: "Route not found." })
);

// ── Global error handler ──
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error." });
});

// ── DB Connection + Server Start ──
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shfcd";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => {
            console.log(`🚀 SHFCD API listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });
