const Joi = require("@hapi/joi");

module.exports = function (data) {
  const commentJoiSchema = Joi.object({
    comment: Joi.string().max(100).required(),
    postID: Joi.string().required(),
  });
  return commentJoiSchema.validate(data);
};
