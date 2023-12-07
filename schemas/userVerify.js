const Joi = require("joi");

const userVerify = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
  }),
});

module.exports = userVerify;
