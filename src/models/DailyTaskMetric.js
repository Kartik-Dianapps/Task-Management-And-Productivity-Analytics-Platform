const mongoose = require("mongoose");

const dailyTaskMetricSchema = new mongoose.Schema({
    date: { type: Date, unique: true },
    totalTasksCreated: Number,
    totalTasksCompleted: Number,
    activeUsers: Number,
});

module.exports = mongoose.model("DailyTaskMetric", dailyTaskMetricSchema);
