const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    isEdited: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
