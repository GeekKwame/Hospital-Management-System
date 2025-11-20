const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const config = require("../config");
const { logAction } = require("../utils/auditLogger");

const sanitizeUser = (userInstance) => {
    const user = userInstance.get({ plain: true });
    delete user.password_hash;
    return user;
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Register
exports.register = async (req, res) => {
    const requiredFields = ["first_name", "last_name", "email", "phone", "role", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
    }

    try {
        const { first_name, last_name, email, phone, role, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: "User with the same email or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email,
            phone,
            role,
            password_hash: hashedPassword
        });

        await logAction({
            userId: user.user_id,
            action: "USER_REGISTERED",
            resource: "User",
            details: { user_id: user.user_id, role: user.role }
        });

        res.status(201).json({ message: "User registered successfully", user: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });

        await logAction({
            userId: user.user_id,
            action: "USER_LOGIN",
            resource: "Auth",
            details: { user_id: user.user_id }
        });

        res.json({ message: "Login successful", token, user: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            const token = crypto.randomBytes(32).toString("hex");
            await PasswordResetToken.create({
                user_id: user.user_id,
                token_hash: hashToken(token),
                expires_at: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
                used: false
            });

            await logAction({
                userId: user.user_id,
                action: "PASSWORD_RESET_REQUESTED",
                resource: "Auth",
                details: { user_id: user.user_id }
            });

            const payload = { message: "If your account exists, a reset link has been issued." };
            if (config.NODE_ENV !== "production") {
                payload.token = token;
            }
            return res.json(payload);
        }

        res.json({ message: "If your account exists, a reset link has been issued." });
    } catch (error) {
        res.status(500).json({ error: "Unable to process password reset request" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }

    try {
        const tokenHash = hashToken(token);
        const resetToken = await PasswordResetToken.findOne({
            where: {
                token_hash: tokenHash,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            },
            include: [{ model: User, as: "user" }]
        });

        if (!resetToken) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await resetToken.user.update({ password_hash: hashedPassword });
        await resetToken.update({ used: true });

        await logAction({
            userId: resetToken.user.user_id,
            action: "PASSWORD_RESET_COMPLETED",
            resource: "Auth",
            details: { user_id: resetToken.user.user_id }
        });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Unable to reset password" });
    }
};
