const Joi = require("@hapi/joi");

function signupJoiValidation(data) {
  const signupJoiSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return signupJoiSchema.validate(data);
}

function loginJoiValidation(data) {
  const loginJoiSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return loginJoiSchema.validate(data);
}

module.exports.signupJoiValidation = signupJoiValidation;
module.exports.loginJoiValidation = loginJoiValidation;
