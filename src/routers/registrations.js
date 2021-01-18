const router = require("express").Router();

const registrations = require("../controllers/registrations");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

// const forgotPassword = require("../controllers/forgotPassword");

router.post(
  "/",
  authMiddleware,
  roleChecker.admin,
  registrations.createRegistration
);
router.patch(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  registrations.updateRegistrator
);
router.delete(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  registrations.deleteRegistrator
);
router.get("/", registrations.getAllRegistrator);
router.get("/:id", registrations.getRegistratorDetail);

module.exports = router;
