const Joi = require('joi');



const schema = Joi.object({
  longURL: Joi.string().required()
});

const UrlValidator = (params) => {

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

module.exports = UrlValidator;
