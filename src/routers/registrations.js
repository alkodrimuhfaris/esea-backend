const router = require("express").Router();

const registrations = require("../controllers/registrations");

const roleChecker = require("../middlewares/roleChecker");

router.post("/", registrations.createRegistration);
router.patch("/:id", roleChecker.paramsNumber, registrations.updateRegistrator);
router.delete(
  "/:id",
  roleChecker.paramsNumber,
  registrations.deleteRegistrator
);
router.get("/", registrations.getAllRegistrator);
router.get(
  "/:id",
  roleChecker.paramsNumber,
  registrations.getRegistratorDetail
);

module.exports = router;
