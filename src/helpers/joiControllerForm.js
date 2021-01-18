/* eslint-disable no-useless-escape */
const joi = require("joi");
const bcrypt = require("bcryptjs");

const requiring = (requires, joiObj) => {
  if (requires === "put") {
    console.log(joiObj);
    joiObj = joi.object({ ...joiObj }).fork(Object.keys(joiObj), (item) =>
      item.required().messages({
        "string.empty": "Forms can not be empty!",
        "any.required": "All Forms must be filled",
      })
    );
  } else if (requires === "patch") {
    joiObj = joi
      .object({ ...joiObj })
      .fork(Object.keys(joiObj), (item) => item.optional().allow(null, "", 0));
  } else if (requires === "create") {
    joiObj = joi.object({ ...joiObj }).fork(Object.keys(joiObj), (item) =>
      item.messages({
        "any.required": "All Forms must be filled",
      })
    );
  }
  return joiObj;
};

const sanitizeForm = (data = []) => {
  data.forEach((form) => {
    Object.keys(form).forEach(
      (key) =>
        (!form[key] || (typeof form[key] === "string" && !form[key].trim())) &&
        delete form[key]
    );
  });
  return data;
};

module.exports = {
  userValidate: async (body, requires = "create") => {
    let user = {
      name: joi.string().required(),
      password: joi.string().alphanum().min(3).max(30).required(),
      email: joi.string().required(),
      phone: joi
        .string()
        .regex(
          /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
        )
        .required(),
    };

    user = requiring(requires, user);
    const { value: data, error } = user.validate(body);
    if (error) throw new Error(error);
    let { password } = data;
    password && (password = await bcrypt.hash(password, 10));
    Object.assign(data, { password });
    const [result] = sanitizeForm([data]);
    return result;
  },
  productValidate: async (body, requires = "create") => {
    let product = {
      productName: joi.string().required(),
      price: joi.number().required(),
      description: joi.string().required(),
      stocks: joi.number().required(),
      sold: joi.number().required(),
    };

    product = requiring(requires, product);

    const { value: data, error } = product.validate(body);
    if (error) throw new Error(error);
    const [result] = sanitizeForm([data]);
    return result;
  },
  registrationValidate: async (body, requires = "create") => {
    let registration = {
      name: joi.string().required(),
      email: joi.string().required(),
      phone: joi
        .string()
        .regex(
          /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
        )
        .required(),
    };

    registration = requiring(requires, registration);

    const { value: data, error } = registration.validate(body);
    if (error) throw new Error(error);
    const [result] = sanitizeForm([data]);
    return result;
  },
};
