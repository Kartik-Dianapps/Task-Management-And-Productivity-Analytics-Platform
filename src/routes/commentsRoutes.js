const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const commentCtrl = require("../controllers/commentsController");

// Add & list comments for a task
router.post("/tasks/:taskId/comments", auth, commentCtrl.addComment);
router.get("/tasks/:taskId/comments", auth, commentCtrl.getTaskComments);

// Update & delete comment
router.put("/comments/:id", auth, commentCtrl.updateComment);
router.delete("/comments/:id", auth, commentCtrl.deleteComment);

module.exports = router;
