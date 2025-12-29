const router = require("express").Router();
const auth = require("../middleware/auth");
const { register, login, logout, me, updateProfile } = require("../controllers/authController");
const upload = require("../middleware/upload");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);
router.put("/profile", auth, upload.single("avatar"), updateProfile);


module.exports = router;
