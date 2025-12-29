const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/roleCheck");
const ctrl = require("../controllers/analyticsController");

// System-wide overview → admin & manager only
router.get(
    "/overview",
    auth,
    role("admin", "manager"),
    ctrl.overview
);

// User analytics
// admin & manager → any user
// user → only self (handled in controller)
router.get(
    "/user/:userId",
    auth,
    ctrl.userAnalytics
);

// Trending tasks → admin & manager only
router.get(
    "/tasks/trending",
    auth,
    role("admin", "manager"),
    ctrl.trendingTasks
);

module.exports = router;
