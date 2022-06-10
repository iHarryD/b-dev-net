const Joi = require("@hapi/joi");

module.exports = function (data) {
  const postJoiSchema = Joi.object({
    caption: Joi.string().max(500).required(),
    media: Joi.array().max(3),
  });
  return postJoiSchema.validate(data);
};
