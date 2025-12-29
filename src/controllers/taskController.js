const Task = require("../models/Task");
const logTaskActivity = require("../utils/logTaskActivity");
const AppError = require("../utils/AppError");

/**
 * POST /api/tasks
 * manager/admin only
 */
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user._id,
        });

        await logTaskActivity({
            taskId: task._id,
            userId: req.user._id,
            action: "created",
            req,
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks
 * pagination + filtering + sorting
 */
exports.getTasks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, priority, assignedTo, sortBy } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        let sort = {};
        if (sortBy === "dueDate") sort.dueDate = 1;
        if (sortBy === "priority") sort.priority = 1;
        if (sortBy === "createdAt") sort.createdAt = -1;

        const tasks = await Task.find(filter)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Task.countDocuments(filter);

        res.json({
            page: Number(page),
            total,
            tasks,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/:id
 */
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");

        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/tasks/:id
 * creator or admin
 */
exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        if (
            task.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(new AppError("Not allowed", 403));
        }

        Object.assign(task, req.body);
        await task.save();

        await logTaskActivity({
            taskId: task._id,
            userId: req.user._id,
            action: "updated",
            req,
        });

        res.json(task);
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/tasks/:id
 * admin only
 */
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/tasks/:id/complete
 */
exports.completeTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        if (task.status === "completed") {
            return next(new AppError("Task already completed", 400));
        }

        task.status = "completed";
        task.completedAt = new Date();
        await task.save();

        await logTaskActivity({
            taskId: task._id,
            userId: req.user._id,
            action: "completed",
            req,
        });

        res.json(task);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/my-tasks
 */
exports.myTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .sort({ dueDate: 1 });

        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/search?q=keyword
 */
exports.searchTasks = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return next(new AppError("Search query is required", 400));
        }

        const tasks = await Task.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } },
            ],
        })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email");

        res.json(tasks);
    } catch (err) {
        next(err);
    }
};
