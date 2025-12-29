const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("* * * * *", async () => {
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await User.updateMany(
        {
            lastLogin: { $lt: threshold },
            isActive: true
        },
        { isActive: false }
    );

    console.log(`Marked ${result.modifiedCount} users inactive`);
});

