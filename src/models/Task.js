const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    dueDate: Date,
    tags: [String],
    completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
