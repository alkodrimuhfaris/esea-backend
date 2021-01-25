const responseStandard = require("../helpers/response");

const productModel = require("../models/products");
const categoryModel = require("../models/categories");

const pagination = require("../helpers/pagination");

const joiForm = require("../helpers/joiControllerForm");

module.exports = {
  getAllProducts: async (req, res) => {
    const path = "products";
    const { limit, page } = req.query;
    try {
      const { results, count } = await productModel.getAllProducts(
        {},
        req.query
      );
      const pageInfo = pagination.paging(count, page, limit, path, req);
      const msg = count
        ? "List of products"
        : "There is no product in the list";
      return responseStandard(res, msg, { results, pageInfo });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  getProductDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const [product] = await productModel.getProduct({ id });
      console.log(product);
      let category = {};
      if (product) {
        [category] = await categoryModel.getCategory({
          id: product.categoryId,
        });
      }
      const msg = product ? "Detail Product" : "Id is not valid";
      return responseStandard(res, msg, {
        results: { product, category },
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  createProduct: async (req, res) => {
    console.log(req.file);
    const picture = req.file ? "Uploads/" + req.file.filename : null;
    if (!picture) {
      return responseStandard(res, "insert picture!", {}, 400, false);
    }
    try {
      const productData = await joiForm.productValidate(req.body);
      const { category } = productData;
      delete productData.category;
      const { results, created } = await categoryModel.searchOrCreateCategory({
        categoryName: category,
      });
      Object.assign(productData, { categoryId: results[0].id, picture });
      const msgCreated = created ? " and success created new category" : "";
      const createResult = await productModel.creteProducts(productData);
      if (!createResult.insertId) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(productData, { id: createResult.insertId });
      return responseStandard(
        res,
        "succes create product" + msgCreated,
        { result: productData },
        201,
        true
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const picture = req.file ? "Uploads/" + req.file.filename : null;
    try {
      const productData = await joiForm.productValidate(req.body, "patch");
      const { category } = productData;
      if (picture) {
        Object.assign(productData, { picture });
      }
      let msgCreated = "";
      if (category) {
        delete productData.category;
        const { results, created } = await categoryModel.searchOrCreateCategory(
          {
            categoryName: category,
          }
        );
        Object.assign(productData, { categoryId: results[0].id });
        msgCreated = created ? " and success created new category" : "";
      }
      const updateResult = await productModel.updateProducts(productData, {
        id,
      });
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(productData, { id });
      return responseStandard(res, "succes create product" + msgCreated, {
        result: productData,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const { results, count } = await productModel.getAllProducts({ id }, {});
      if (!count) {
        return responseStandard(res, "item not found!", {}, 400, false);
      }
      const deleteItem = await productModel.deleteProduct({ id });
      if (!deleteItem.affectedRows) {
        return responseStandard(res, "fail to delete item", {}, 400, false);
      }
      return responseStandard(
        res,
        "Delete " + results[0].productName + " success",
        {}
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
};
