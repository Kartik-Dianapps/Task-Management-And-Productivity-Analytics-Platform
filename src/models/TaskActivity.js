const mongoose = require("mongoose");

const taskActivitySchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: {
        type: String,
        enum: ["created", "updated", "completed", "commented"],
        required: true,
    },
    ipAddress: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaskActivity", taskActivitySchema);
