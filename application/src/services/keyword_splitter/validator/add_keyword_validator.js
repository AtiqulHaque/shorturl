const Joi = require('joi');


const schema = Joi.object({
  split: Joi.string().required(),
  keyword: Joi.string().required()
});

const KeywordValidator = (params) => {

  const result = schema.validate(params);

  if (typeof result.error != "undefined") {

    return {
      status: "validation-error",
      payload: result.error['message']
    };
  }

  return {
    status: "success",
    payload: result.value
  };

}

module.exports = KeywordValidator;
