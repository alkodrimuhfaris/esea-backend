const router = require("express").Router();

const webVisitor = require("../controllers/webVistor");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

router.post("/start", webVisitor.startSession);
router.post("/end", roleChecker.visitor, webVisitor.endSession);
router.patch(
  "/admin/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  webVisitor.editVisitor
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  webVisitor.deleteVisitor
);
router.get(
  "/admin",
  authMiddleware,
  roleChecker.admin,
  webVisitor.getAllVisitor
);
router.get(
  "/admin/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  webVisitor.getVisitorDetail
);

module.exports = router;
