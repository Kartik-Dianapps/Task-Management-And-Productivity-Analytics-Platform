const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/roleCheck");
const taskCtrl = require("../controllers/taskController");

router.get("/search", auth, taskCtrl.searchTasks);

router.post("/", auth, role("manager", "admin"), taskCtrl.createTask);

router.get("/", auth, taskCtrl.getTasks);

router.get("/my-tasks", auth, taskCtrl.myTasks);

router.get("/:id", auth, taskCtrl.getTaskById);

router.put("/:id", auth, taskCtrl.updateTask);

router.delete("/:id", auth, role("admin"), taskCtrl.deleteTask);

router.patch("/:id/complete", auth, taskCtrl.completeTask);

module.exports = router;
