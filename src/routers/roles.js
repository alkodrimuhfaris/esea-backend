const router = require("express").Router();

const roles = require("../controllers/roles");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

// const forgotPassword = require("../controllers/forgotPassword");

router.post("/", authMiddleware, roleChecker.admin, roles.createRole);
router.patch(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  roles.updateRole
);
router.delete(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  roles.deleteRole
);
router.get("/", roles.viewRoles);
router.get("/:id", roles.getRoleDetail);

module.exports = router;
