const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate a signed JWT token for a user ID.
 */
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password.",
            });
        }

        // Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "Email already in use." });
        }

        const user = await User.create({ name, email, password });
        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Server error.", error: err.message });
    }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password.",
            });
        }

        // Retrieve user WITH password field (normally excluded)
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = signToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Server error.", error: err.message });
    }
};

/**
 * GET /api/auth/me
 * Returns current authenticated user (requires protect middleware).
 */
const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: { id: req.user._id, name: req.user.name, email: req.user.email },
    });
};

module.exports = { register, login, getMe };
