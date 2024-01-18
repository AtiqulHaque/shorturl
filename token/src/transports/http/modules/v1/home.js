const Router = require("@koa/router");
const AddValidator = require('./../../../../services/url/validator/add_url_validator')
const uniqueService = require('../../../../services/unique_id/unique_id_service')
const {
  RESPONSE_VALIDATION_ERROR,
  REDIS_COUNT,
  UPDATE_QUEUE,
  UPDATE_JOB,
  RESPONSE_SUCCESS,
  INSERT_JOB,
  INSERT_QUEUE,
  REDIS_KEY_SPLIT,
  REDIS_KEY_MAPPING,
  REDIS_KEY_ACTUAL_KEYWORD,
  RESPONSE_ERROR,
  TYPE_OF_UNDEFINED,
  REJECT_FOR_SPLIT,
  ACCEPT_FOR_SPLIT,
  RESPONSE_EMPTY,
  REDIS_KEY_STATUS,
  CACHE_EXPIRE_TIME,
  CACHE_MEMORY_SIZE
} = require("./../../../../constants/keyword")

const createLogger = require("../../../../utils/logging");

const logger = createLogger({
  service: "Parse keyword"
});


const router = new Router();

router.post("/get/key", async (ctx, next) => {

  try {

    // Validate keyword before parse
    let validatorResponse = AddValidator(ctx.request.body);

    if (typeof validatorResponse.status !== TYPE_OF_UNDEFINED &&
      validatorResponse.status === RESPONSE_VALIDATION_ERROR) {

      ctx.body = {
        status: RESPONSE_VALIDATION_ERROR,
        payload: validatorResponse.payload
      };

      return await next();
    }


    ctx.body = {
      status: RESPONSE_SUCCESS,
      payload: await uniqueService.getUniqueID(validatorResponse.payload.longURL)
    };


    return await next();
  } catch (er) {
  console.log(er);
  logger.error(`Something bad happen base exception occurred`, {er})
  next(er);
}


});

module.exports = router