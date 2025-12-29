const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("* * * * *", async () => {
    const now = new Date();

    const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        status: { $ne: "completed" },
    });

    overdueTasks.forEach(task => {
        console.log(`Reminder: Task "${task.title}" is overdue`);
    });
});
