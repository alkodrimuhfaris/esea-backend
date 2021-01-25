const joi = require("joi");
const bcrypt = require("bcryptjs");
const responseStandard = require("../helpers/response");

const userModel = require("../models/users");

const pagination = require("../helpers/pagination");

const joiForm = require("../helpers/joiControllerForm");

module.exports = {
  getAllUsers: async (req, res) => {
    const path = "users";
    const { limit, page } = req.query;
    try {
      const { results, count } = await userModel.getAllUsers({}, req.query);
      const pageInfo = pagination.paging(count, page, limit, path, req);
      const msg = count ? "List of users" : "There is no user in the list";
      return responseStandard(res, msg, { results, pageInfo });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  getUserDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await userModel.getUser({ id });
      delete result.password;
      const msg = result ? "Detail User" : "Id is not valid";
      return responseStandard(res, msg, {
        result,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  getOwnProfile: async (req, res) => {
    const { id } = req.user;
    try {
      const [result] = await userModel.getUser({ id });
      delete result.password;
      const msg = result ? "Detail User" : "Id is not valid";
      return responseStandard(res, msg, {
        result,
      });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  createUser: async (req, res) => {
    try {
      const userData = await joiForm.adminUserValidate(req.body);
      const createResult = await userModel.createUser(userData);
      if (!createResult.insertId) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(userData, { id: createResult.insertId });
      delete userData.password;
      return responseStandard(
        res,
        "succes create user!",
        { result: userData },
        201,
        true
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const avatar = req.file ? "Uploads/" + req.file.filename : null;
    try {
      const { password, avatar: unwantedAva } = req.body;
      password && delete req.body.password;
      unwantedAva && delete req.body.avatar;
      const userData = await joiForm.userValidate(req.body, "patch");
      Object.assign(userData, { avatar });
      const updateResult = await userModel.updateUser(userData, {
        id,
      });
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(userData, { id });
      return responseStandard(res, "Profile updated!", { result: userData });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  updateSelf: async (req, res) => {
    const { id } = req.user;
    const avatar = req.file ? "Uploads/" + req.file.filename : null;
    try {
      const { password, avatar: unwantedAva } = req.body;
      password && delete req.body.password;
      unwantedAva && delete req.body.avatar;
      const userData = await joiForm.userValidate(req.body, "patch");
      Object.assign(userData, { avatar });
      const updateResult = await userModel.updateUser(userData, {
        id,
      });
      if (!updateResult.affectedRows) {
        return responseStandard(res, "internal server error", {}, 500, false);
      }
      Object.assign(userData, { id });
      return responseStandard(res, "Profile updated!", { result: userData });
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteAvatar: async (req, res) => {
    const { id } = req.user;
    try {
      const { count } = await userModel.getAllUsers({ id }, {});
      if (!count) {
        return responseStandard(res, "Id not found!", {}, 400, false);
      }
      const deleteAva = await userModel.updateUser({ avatar: "" }, { id });
      if (!deleteAva.affectedRows) {
        return responseStandard(res, "Fail to delete avatar", {}, 400, false);
      }
      return responseStandard(res, "Delete user avatar success", {});
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteSelf: async (req, res) => {
    const { id } = req.user;
    try {
      const { results, count } = await userModel.getAllUsers({ id }, {});
      if (!count) {
        return responseStandard(res, "Id not found!", {}, 400, false);
      }
      const deleteItem = await userModel.deleteUser({ id });
      if (!deleteItem.affectedRows) {
        return responseStandard(res, "fail to delete user", {}, 400, false);
      }
      return responseStandard(
        res,
        "Delete user: " + results[0].name + " success",
        {}
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const { results, count } = await userModel.getAllUsers({ id }, {});
      if (!count) {
        return responseStandard(res, "item not found!", {}, 400, false);
      }
      const deleteItem = await userModel.deleteUser({ id });
      if (!deleteItem.affectedRows) {
        return responseStandard(res, "fail to delete user", {}, 400, false);
      }
      return responseStandard(
        res,
        "Delete user: " + results[0].name + " success",
        {}
      );
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  updatePassword: async (req, res) => {
    const { id: userId } = req.user;
    const schema = joi.object({
      oldPassword: joi.string().required(),
      newPassword: joi.string().required(),
      confirmNewPassword: joi.string().required().valid(joi.ref("newPassword")),
    });
    const { value: credentials, error } = schema.validate(req.body);
    if (error) {
      return responseStandard(
        res,
        "Error",
        { error: error.message },
        400,
        false
      );
    }
    try {
      let { oldPassword, newPassword } = credentials;

      const data = await userModel.getUser({ id: userId });
      if (!data.length) {
        return responseStandard(res, "Forbidden Access!", {}, 403, false);
      }
      const passCheck = await bcrypt.compare(oldPassword, data[0].password);
      if (!passCheck) {
        return responseStandard(
          res,
          "Your current password is wrong!",
          {},
          400,
          false
        );
      }
      newPassword = await bcrypt.hash(newPassword, 10);
      const patchPassword = await userModel.updateUser(
        { password: newPassword },
        { id: userId }
      );
      if (!patchPassword.affectedRows) {
        return responseStandard(res, "Update password failed!", {}, 500, false);
      }
      return responseStandard(res, "Password updated!", {}, 200, true);
    } catch (err) {
      console.log(err);
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
};
