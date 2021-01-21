const router = require("express").Router();

const users = require("../controllers/users");

const roleChecker = require("../middlewares/roleChecker");

// admin
router.post("/admin", roleChecker.admin, users.createUser);
router.patch(
  "/admin/:id",
  roleChecker.admin,
  roleChecker.paramsNumber,
  users.updateUser
);
router.delete(
  "/admin/:id",
  roleChecker.admin,
  roleChecker.paramsNumber,
  users.deleteUser
);
router.get(
  "/admin/all",
  roleChecker.admin,
  roleChecker.paramsNumber,
  users.getAllUsers
);
router.get(
  "/admin/detail/:id",
  roleChecker.admin,
  roleChecker.paramsNumber,
  users.getUserDetail
);

// profile user
router.get("/profile", users.getOwnProfile);
router.patch("/profile", users.updateSelf);
router.delete("/profile", users.deleteSelf);
router.delete("/profile/avatar", users.deleteAvatar);
router.post("/profile/password", users.updatePassword);

module.exports = router;
