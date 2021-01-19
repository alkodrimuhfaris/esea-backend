const router = require("express").Router();

const products = require("../controllers/products");

const authMiddleware = require("../middlewares/auth");

const roleChecker = require("../middlewares/roleChecker");

const multerSingle = require("../middlewares/multerSingle");

router.post(
  "/",
  authMiddleware,
  roleChecker.admin,
  multerSingle("picture"),
  products.createProduct
);
router.patch(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  multerSingle("picture"),
  products.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  roleChecker.admin,
  roleChecker.paramsNumber,
  products.deleteProduct
);
router.get("/", products.getAllProducts);
router.get("/:id", products.getProductDetail);

module.exports = router;
