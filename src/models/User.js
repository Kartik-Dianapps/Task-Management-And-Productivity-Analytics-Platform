const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    fullName: String,
    designation: String,
    role: { type: String, enum: ["user", "manager", "admin"], default: "user" },
    avatar: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
});

module.exports = mongoose.model("User", userSchema);
