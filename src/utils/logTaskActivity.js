const TaskActivity = require("../models/TaskActivity");

module.exports = async ({ taskId, userId, action, req }) => {
    try {
        await TaskActivity.create({
            taskId,
            userId,
            action,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
    } catch (err) {
        console.error("Activity log failed:", err.message);
    }
};
