const response = require("../helpers/response");

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
};
