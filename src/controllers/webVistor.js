const responseStandard = require("../helpers/response");
// const io = require("../app");

const webVisitorModel = require("../models/webVisitor");

const pagination = require("../helpers/pagination");

const joiForm = require("../helpers/joiControllerForm");

const { v4: uuidv4 } = require("uuid");

const moment = require("moment");

module.exports = {
  getAllVisitor: async (req, res) => {
    const path = "visitors";
    const { limit, page } = req.query;
    try {
      const { results, count } = await webVisitorModel.getAllVisitors(
        {},
        req.query
      );
      const pageInfo = pagination.paging(count, page, limit, path, req);
      const msg = count
        ? "List of Visitors"
        : "There is no Visitor in the list";
      return responseStandard(res, msg, { results, pageInfo });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  getVisitorDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await webVisitorModel.getVisitor({ id });
      console.log(result);
      const msg = result ? "Detail Visitor" : "Id is not valid";
      return responseStandard(res, msg, {
        result,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  startSession: async (req, res) => {
    try {
      const {
        ip,
        city,
        country_name: country,
        org: provider,
        startSession,
      } = req.body;
      const dataVisitor = {
        ip,
        city,
        country,
        provider,
        startSession,
      };
      const uuid = uuidv4();
      Object.assign(dataVisitor, { uuid });
      const webVisitorData = await joiForm.webVisitorValidate(dataVisitor);
      const createResult = await webVisitorModel.createVisitor(webVisitorData);
      if (!createResult.insertId) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(webVisitorData, { id: createResult.insertId });
      // socket connection
      // io.emit(sendEvent, { senderData, chat });
      return responseStandard(
        res,
        "Add visitor success",
        { result: webVisitorData },
        201,
        true
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  endSession: async (req, res) => {
    try {
      const webVisitorData = await joiForm.webVisitorValidate(req.body);
      const { startSession, endSession, id, uuid } = webVisitorData;
      const timeVisit = moment(endSession).diff(
        moment(startSession),
        "minutes"
      );
      const updateResult = await webVisitorModel.updateVisitor(
        { endSession, timeVisit },
        {
          id,
          uuid,
        }
      );
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      return responseStandard(res, "update visitor success", {
        result: webVisitorData,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  editVisitor: async (req, res) => {
    const { id } = req.params;
    try {
      const webVisitorData = await joiForm.webVisitorValidate(req.body);
      const updateResult = await webVisitorModel.updateVisitor(webVisitorData, {
        id,
      });
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      return responseStandard(res, "update visitor success", {
        result: webVisitorData,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteVisitor: async (req, res) => {
    const { id } = req.params;
    try {
      const { results, count } = await webVisitorModel.getAllwebVisitors(
        { id },
        {}
      );
      if (!count) {
        return responseStandard(res, "visitor not found!", {}, 400, false);
      }
      const deleteItem = await webVisitorModel.deletewebVisitors({ id });
      if (!deleteItem.affectedRows) {
        return responseStandard(
          res,
          "Failed to delete visitor",
          {},
          400,
          false
        );
      }
      return responseStandard(
        res,
        "Delete data of " + results[0].ip + " success",
        {}
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
};
