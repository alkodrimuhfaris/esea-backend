const webVisitorModel = require("../models/webVisitor");
const joiForm = require("../helpers/joiControllerForm");
const moment = require("moment");

module.exports = {
  endSession: async (ipData) => {
    try {
      const webVisitorData = await joiForm.webVisitorValidate(ipData);
      const { startSession, endSession, id, uuid } = webVisitorData;
      const timeVisit = moment(endSession).diff(
        moment(startSession),
        "seconds"
      );
      const updateResult = await webVisitorModel.updateVisitor(
        { endSession, timeVisit },
        {
          id,
          uuid,
        }
      );
      if (!updateResult.affectedRows) {
        console.log("error update web visitor to database");
      }
      console.log("visitor logout recorded");
    } catch (err) {
      console.log(err);
    }
  },
};
