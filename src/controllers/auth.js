const jwt = require("jsonwebtoken");
const user = require("../models/users");

const { userValidate } = require("../helpers/joiControllerForm");
const responseStandard = require("../helpers/response");
const bcrypt = require("bcryptjs");

module.exports = {
  loginController: async (req, res) => {
    const { email, password } = req.body;
    const credentials = {
      email,
      password,
    };
    try {
      const data = await user.getUser({ email: credentials.email });

      // checking is there any user data with email
      if (!data[0]) {
        return responseStandard(
          res,
          "The email you input is invalid",
          {},
          400,
          false
        );
      }

      // comparing password with bcrypt
      const passCheck = await bcrypt.compare(
        credentials.password,
        data[0].password
      );

      // checking password
      if (!passCheck) {
        return responseStandard(res, "Wrong Password!", {}, 400, false);
      }

      // jwt sign
      jwt.sign(
        {
          id: data[0].id,
          roleId: data[0].roleId,
        },
        process.env.APP_KEY,
        (err, token) => {
          if (err) {
            return responseStandard(res, err.message, {}, 400, false);
          }
          console.log(token);
          return responseStandard(res, "login Success!", { token });
        }
      );
    } catch (err) {
      return responseStandard(res, err.message, {}, 500, false);
    }
  },
  signupController: async (req, res) => {
    try {
      const userCredentials = await userValidate(req.body);

      // assign role_id to forms
      Object.assign(userCredentials, { roleId: 2 });

      // create user
      const results = await user.createUser(userCredentials);
      console.log(results);

      if (results.insertId) {
        delete userCredentials.password;
        Object.assign(userCredentials, { id: results.insertId });
        return responseStandard(
          res,
          "user has been created",
          { data: { ...userCredentials } },
          201
        );
      } else {
        return responseStandard(res, "Internal server error", {}, 500, false);
      }
    } catch (err) {
      let msg = "Sign up eror!";
      console.log(err);
      if (err.errno) {
        msg = err.errno === 1062 ? "Email already taken" : "Sign up eror!";
      }
      return responseStandard(res, msg, { error: err }, 500, false);
    }
  },
};
