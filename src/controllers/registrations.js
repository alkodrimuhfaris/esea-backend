const responseStandard = require("../helpers/response");
// const io = require("../app");

const registrationModel = require("../models/registrations");

const pagination = require("../helpers/pagination");

const joiForm = require("../helpers/joiControllerForm");

module.exports = {
  getAllRegistrator: async (req, res) => {
    const path = "registrations";
    const { limit, page } = req.query;
    try {
      const { results, count } = await registrationModel.getAllRegistrations(
        {},
        req.query
      );
      const pageInfo = pagination.paging(count, page, limit, path, req);
      const msg = count
        ? "List of registrators"
        : "There is no registrator in the list";
      return responseStandard(res, msg, { results, pageInfo });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  getRegistratorDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await registrationModel.getRegistration({ id });
      console.log(result);
      const msg = result ? "Detail Registrator" : "Id is not valid";
      return responseStandard(res, msg, {
        result,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  createRegistration: async (req, res) => {
    try {
      const registrationData = await joiForm.registrationValidate(req.body);
      const createResult = await registrationModel.creteRegistrations(
        registrationData
      );
      if (!createResult.insertId) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(registrationData, { id: createResult.insertId });
      // socket connection
      // io.emit(sendEvent, { senderData, chat });
      return responseStandard(
        res,
        "Registration success",
        { result: registrationData },
        201,
        true
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  updateRegistrator: async (req, res) => {
    const { id } = req.params;
    try {
      const registrationData = await joiForm.registrationValidate(
        req.body,
        "patch"
      );
      const updateResult = await registrationModel.updateRegistrations(
        registrationData,
        {
          id,
        }
      );
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(registrationData, { id });
      return responseStandard(res, "Registration success", {
        result: registrationData,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteRegistrator: async (req, res) => {
    const { id } = req.params;
    try {
      const { results, count } = await registrationModel.getAllRegistrations(
        { id },
        {}
      );
      if (!count) {
        return responseStandard(res, "item not found!", {}, 400, false);
      }
      const deleteItem = await registrationModel.deleteRegistrations({ id });
      if (!deleteItem.affectedRows) {
        return responseStandard(
          res,
          "fail to delete registrator",
          {},
          400,
          false
        );
      }
      return responseStandard(
        res,
        "Delete data of " + results[0].name + " success",
        {}
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
};
