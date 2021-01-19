const response = require("../helpers/response");

const categoryModel = require("../models/categories");
const productModel = require("../models/products");

const pagination = require("../helpers/pagination");
const joi = require("joi");

module.exports = {
  viewCategories: async (req, res) => {
    const path = "categories";
    const { page, limit } = req.query;
    try {
      const { results, count } = await categoryModel.getAllCategories(
        {},
        req.query
      );
      const pageInfo = pagination.paging(count, page, limit, path, req.query);
      const msg = results.length
        ? "List of Categories"
        : "There is no item in the list";
      return response(res, msg, { results, pageInfo });
    } catch (error) {
      console.log(error);
      return response(res, "Internal server error", {}, 500, false);
    }
  },
  viewCategoriesById: async (req, res) => {
    const { id } = req.params;
    const path = "categories/" + id;
    const { limit, page } = req.query;
    try {
      const {
        results: category,
        count: categoryCount,
      } = await categoryModel.getAllCategories({ id });
      if (categoryCount) {
        const { results: products, count } = await productModel.getAllProducts({
          categoryId: id,
        });
        const pageInfo = pagination.paging(count, page, limit, path, req.query);
        const msg = count
          ? "Items on category id: " + id
          : "There is no items in here";
        return response(res, msg, {
          category: category[0],
          products,
          pageInfo,
        });
      } else {
        const pageInfo = pagination.paging(0, page, limit, path, req.query);
        return response(res, "There is no category in here", {
          category: {},
          products: [],
          pageInfo,
        });
      }
    } catch (error) {
      console.log(error);
      return response(res, "Internal server error", {}, 500, false);
    }
  },
  createCategory: async (req, res) => {
    const schema = joi.object({
      categoryName: joi.string(),
    });
    const { value: data, error } = schema.validate(req.body);
    if (error) {
      return response(res, error.message, {}, 400, false);
    }
    try {
      const result = await categoryModel.creteCategories(data);
      if (result.insertId) {
        return response(res, "Category has been created", {
          result: { id: result.insertId, ...data },
        });
      } else {
        return response(res, "Internal Server error", {}, 500, false);
      }
    } catch (error) {
      console.log(error);
      return response(res, error.message, {}, 500, false);
    }
  },
  updateCategories: async (req, res) => {
    const { id } = req.params;
    const schema = joi.object({
      name: joi.string(),
    });
    const { value: data, error } = schema.validate(req.body);
    if (error) {
      return response(res, error.message, {}, 400, false);
    }
    try {
      const { count } = await categoryModel.getAllCategories({ id }, {});
      if (!count) {
        return response(res, "Id not found!", {}, 500, false);
      }
      const result = await categoryModel.updateCategoriesModel(data, { id });
      if (result.affectedRows) {
        return response(res, "category has been updated!", {
          result: { ...data, id },
        });
      } else {
        return response(res, "Internal server error", {}, 500, false);
      }
    } catch (error) {
      console.log(error);
      return response(res, error.message, {}, 500, false);
    }
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const { count } = await categoryModel.getAllCategories({ id });
      if (!count) {
        return response(res, "Id not found!", {}, 400, false);
      }
      const result = await categoryModel.deleteCategory({ id });
      if (result.affectedRows) {
        return response(res, "category has been deleted!");
      } else {
        return response(res, "Internal server error", {}, 400, false);
      }
    } catch (error) {
      console.log(error);
      return response(res, error.message, {}, 500, false);
    }
  },
};
