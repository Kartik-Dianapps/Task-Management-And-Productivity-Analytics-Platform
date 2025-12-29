const Comment = require("../models/Comments");
const Task = require("../models/Task");
const logTaskActivity = require("../utils/logTaskActivity");
const AppError = require("../utils/AppError");

/**
 * POST /api/tasks/:taskId/comments
 * Add comment to a task
 */
exports.addComment = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return next(new AppError("Task not found", 404));
        }

        const comment = await Comment.create({
            taskId,
            userId: req.user._id,
            content: req.body.content,
        });

        await logTaskActivity({
            taskId,
            userId: req.user._id,
            action: "commented",
            req,
        });

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/tasks/:taskId/comments
 * List comments of a task
 */
exports.getTaskComments = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const comments = await Comment.find({ taskId })
            .populate("userId", "username email")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/comments/:id
 * Update comment (owner only)
 */
exports.updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return next(new AppError("Not allowed", 403));
        }

        comment.content = req.body.content;
        comment.isEdited = true;
        await comment.save();

        res.json(comment);
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/comments/:id
 * Delete comment (owner or admin)
 */
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(new AppError("Comment not found", 404));
        }

        if (
            comment.userId.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(new AppError("Not allowed", 403));
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        next(err);
    }
};
