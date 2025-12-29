const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("./config/db");

connectDb();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorHandler = require("./middleware/errorHandler");

require("./cron/dailyMetrics.job");
require("./cron/inactiveUser.job");
require("./cron/overdueReminder.job");

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.use(errorHandler);

module.exports = app;
