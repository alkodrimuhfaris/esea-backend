const router = require("express").Router();

const categories = require("../controllers/categories");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

router.post("/", authMiddleware, roleChecker.admin, categories.createCategory);
router.patch(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  categories.updateCategories
);
router.delete(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  categories.deleteCategory
);
router.get("/", categories.viewCategories);
router.get("/:id", categories.viewCategoriesById);

module.exports = router;
