const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../middleware/validation");
const { updateProfileSchema } = require("../middleware/validation");
const cloudinary = require("../config/cloudinary");
const UserToken = require('../models/UserToken')
const fs = require('fs');
const AppError = require("../utils/AppError");

exports.register = async (req, res, next) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.message, 400));
        }

        const { username, email, password, fullName, role } = req.body;

        // Check if user already exists
        const exist = await User.findOne({ email });
        if (exist) {
            return next(new AppError("User already exists", 400));
        }
        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hash,
            fullName,
            role: role || "user" // default role if not provided
        });

        // Exclude password in response
        const { password: _, ...userData } = user.toObject();

        res.status(201).json({ message: "Registered successfully", user: userData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return next(new AppError("Invalid credentials", 400));
        }

        if (!user.isActive) {
            return next(
                new AppError("Your account is inactive. Please contact admin.", 403)
            );
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return next(new AppError("Invalid credentials", 400));
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🔥 SINGLE LOGIN — delete old tokens
        await UserToken.deleteMany({ userId: user._id });

        await UserToken.create({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        user.lastLogin = new Date();
        await user.save();

        res.json({ token });
    } catch (err) {
        next(err); // 🔥 GLOBAL ERROR HANDLER
    }
};

exports.logout = async (req, res, next) => {
    try {
        await UserToken.deleteMany({ userId: req.user._id });
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
};

exports.me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        next(error)
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.message, 400));
        }

        let avatarUrl;

        if (req.file) {
            const cloudImg = await cloudinary.uploader.upload(req.file.path, {
                folder: "uploads",
            });

            avatarUrl = cloudImg.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const updates = {
            fullName: req.body.fullName,
            designation: req.body.designation
        };

        if (avatarUrl) updates.avatar = avatarUrl;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated", user });

    } catch (err) {
        next(err);
    }
};