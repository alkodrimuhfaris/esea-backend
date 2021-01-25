/* eslint-disable no-unused-vars */
// const IP = {
//   ip: "180.214.233.87",
//   version: "IPv4",
//   city: "Jakarta",
//   region: "Jakarta",
//   region_code: "JK",
//   country: "ID",
//   country_name: "Indonesia",
//   country_code: "ID",
//   country_code_iso3: "IDN",
//   country_capital: "Jakarta",
//   country_tld: ".id",
//   continent_code: "AS",
//   in_eu: false,
//   postal: null,
//   latitude: -6.1741,
//   longitude: 106.8296,
//   timezone: "Asia/Jakarta",
//   utc_offset: "+0700",
//   country_calling_code: "+62",
//   currency: "IDR",
//   currency_name: "Rupiah",
//   languages: "id,en,nl,jv",
//   country_area: 1919440,
//   country_population: 267663435,
//   asn: "AS45727",
//   org: "Hutchison CP Telecommunications, PT",
// }

// ip	city	country	provider	startSession	endSession	timeVisit

const responseStandard = require("../helpers/response");
// const io = require("../app");

const webVisitorModel = require("../models/webVisitor");

const pagination = require("../helpers/pagination");

const joiForm = require("../helpers/joiControllerForm");

const { v4: uuidv4 } = require("uuid");

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
  addVisitor: async (req, res) => {
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
  updateVisitor: async (req, res) => {
    const { id, uuid } = req.params;
    try {
      const {
        ip,
        city,
        country_name: country,
        org: provider,
        endSession,
      } = req.body;
      const dataVisitor = {
        ip,
        city,
        country,
        provider,
        endSession,
      };
      const webVisitorData = await joiForm.webVisitorValidate(dataVisitor);
      const updateResult = await webVisitorModel.updateVisitor(webVisitorData, {
        id,
        uuid,
      });
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(webVisitorData, { id });
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
