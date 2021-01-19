const response = require("../helpers/response");

const roleModel = require("../models/roles");

const pagination = require("../helpers/pagination");
const joi = require("joi");

module.exports = {
  viewRoles: async (req, res) => {
    const path = "roles";
    const { page, limit } = req.query;
    try {
      const { results, count } = await roleModel.getAllRoles({}, req.query);
      const pageInfo = pagination.paging(count, page, limit, path, req.query);
      const msg = results.length
        ? "List of Roles"
        : "There is no item in the list";
      return response(res, msg, { results, pageInfo });
    } catch (error) {
      console.log(error);
      return response(res, "Internal server error", {}, 500, false);
    }
  },
  getRoleDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await roleModel.getRole({ id });
      const msg = result ? "Detail Role" : "Id is not valid";
      return response(res, msg, {
        result,
      });
    } catch (err) {
      console.log(err);
      return response(res, err.message, {}, 500, false);
    }
  },
  createRole: async (req, res) => {
    const schema = joi.object({
      role: joi.string(),
    });
    const { value: data, error } = schema.validate(req.body);
    if (error) {
      return response(res, error.message, {}, 400, false);
    }
    try {
      const result = await roleModel.creteRoles(data);
      if (result.insertId) {
        return response(res, "Role has been created", {
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
  updateRole: async (req, res) => {
    const { id } = req.params;
    const schema = joi.object({
      role: joi.string(),
    });
    const { value: data, error } = schema.validate(req.body);
    if (error) {
      return response(res, error.message, {}, 400, false);
    }
    try {
      const { count } = await roleModel.getAllRoles({ id }, {});
      if (!count) {
        return response(res, "Id not found!", {}, 500, false);
      }
      const result = await roleModel.updateRoles(data, { id });
      if (result.affectedRows) {
        return response(res, "Role has been updated!", {
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
  deleteRole: async (req, res) => {
    const { id } = req.params;
    try {
      const { count } = await roleModel.getAllRoles({ id });
      if (!count) {
        return response(res, "Id is not found!", {}, 400, false);
      }
      const result = await roleModel.deleteRoles({ id });
      if (result.affectedRows) {
        return response(res, "Role has been deleted!");
      } else {
        return response(res, "Internal server error", {}, 400, false);
      }
    } catch (error) {
      console.log(error);
      return response(res, error.message, {}, 500, false);
    }
  },
};
