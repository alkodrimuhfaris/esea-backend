const router = require("express").Router();

const registrations = require("../controllers/registrations");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

router.post("/", registrations.createRegistration);
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
router.get(
  "/",
  authMiddleware,
  roleChecker.admin,
  registrations.getAllRegistrator
);
router.get(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  registrations.getRegistratorDetail
);

module.exports = router;
