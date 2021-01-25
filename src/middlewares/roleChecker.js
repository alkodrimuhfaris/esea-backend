const response = require("../helpers/response");
const joiValidationForm = require("../helpers/joiControllerForm");

module.exports = {
  paramsProductId: (req, res, next) => {
    let { id, productId } = req.params;
    if (!Number(id) || !Number(productId)) {
      return response(res, "id params must be a number!", {}, 403, false);
    }
    id = Number(id);
    productId = Number(productId);
    req.params.id = id;
    req.params.productId = productId;
    next();
  },
  paramsNumber: (req, res, next) => {
    let { id } = req.params;
    if (!Number(id)) {
      return response(res, "id params must be a number!", {}, 403, false);
    }
    id = Number(id);
    req.params.id = id;
    next();
  },
  admin: (req, res, next) => {
    if (req.user.roleId === 1) {
      next();
    } else {
      return response(res, "Forbidden access", {}, 403, false);
    }
  },
  visitor: async (req, res, next) => {
    try {
      const { id, uuid } = req.body;
      const params = { id, uuid };
      await joiValidationForm(params);
      req.body = { ...req.body, id, uuid };
      next();
    } catch (error) {
      return response(res, "Forbidden access", {}, 403, false);
    }
  },
};
