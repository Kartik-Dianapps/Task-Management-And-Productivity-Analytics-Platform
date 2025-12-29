const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/User");
const DailyTaskMetric = require("../models/DailyTaskMetric");

cron.schedule("*/2 * * * *", async () => {
    const date = new Date();
    date.setSeconds(0, 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalTasksCreated = await Task.countDocuments({
        createdAt: { $gte: startOfDay },
    });

    const totalTasksCompleted = await Task.countDocuments({
        completedAt: { $gte: startOfDay },
    });

    const activeUsers = await User.countDocuments({
        isActive: true,
    });

    await DailyTaskMetric.create({
        date,
        totalTasksCreated,
        totalTasksCompleted,
        activeUsers,
    });

    console.log(`Aggregated metrics for ${date}`);
});

