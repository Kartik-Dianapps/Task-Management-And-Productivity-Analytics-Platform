const Task = require("../models/Task");
const User = require("../models/User");
const TaskActivity = require("../models/TaskActivity");
const AppError = require("../utils/AppError");

/**
 * GET /api/analytics/overview
 */
exports.overview = async (req, res, next) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const activeUsers = await User.countDocuments({ isActive: true });

        res.json({ totalTasks, completedTasks, activeUsers });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/user/:userId
 */
exports.userAnalytics = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // 🔒 Ownership check
        if (
            req.user.role === "user" &&
            req.user._id.toString() !== userId
        ) {
            return next(new AppError("Forbidden", 403));
        }

        const totalAssigned = await Task.countDocuments({
            assignedTo: userId,
        });

        const completed = await Task.countDocuments({
            assignedTo: userId,
            status: "completed",
        });

        const completionRate =
            totalAssigned === 0
                ? 0
                : ((completed / totalAssigned) * 100).toFixed(2);

        res.json({
            userId,
            totalAssigned,
            completed,
            completionRate: `${completionRate}%`,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/tasks/trending
 */
exports.trendingTasks = async (req, res, next) => {
    try {
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const data = await TaskActivity.aggregate([
            { $match: { createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: "$taskId",
                    activityCount: { $sum: 1 },
                },
            },
            { $sort: { activityCount: -1 } },
            { $limit: 5 },
        ]);

        res.json(data);
    } catch (err) {
        next(err);
    }
};
