const router = require("express").Router();

const auth = require("../controllers/auth");

// const forgotPassword = require("../controllers/forgotPassword");

router.post("/login", auth.loginController);
router.post("/signup", auth.signupController);
// router.post("/forgot", forgotPassword.resetPassword);
// router.post("/forgot/reset", forgotPassword.matchResetCode);

module.exports = router;
