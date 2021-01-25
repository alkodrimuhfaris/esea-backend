const router = require("express").Router();

const webVisitor = require("../controllers/webVistor");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

router.post("/public", webVisitor.addVisitor);
router.patch(
  "/public/:id/:uuid",
  roleChecker.visitor,
  webVisitor.updateVisitor
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
