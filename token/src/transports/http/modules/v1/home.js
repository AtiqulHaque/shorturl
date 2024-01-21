const Router = require("@koa/router");
const AddValidator = require('./../../../../services/url/validator/add_url_validator')
const uniqueService = require('../../../../services/unique_id/unique_id_service')
const {postMessageToQueue} = require("../../../../utils/bullmq");
const {
  RESPONSE_VALIDATION_ERROR,
  UPDATE_QUEUE,
  UPDATE_JOB,
  RESPONSE_SUCCESS,
  TYPE_OF_UNDEFINED,
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


    let key = await uniqueService.getUniqueID(validatorResponse.payload.longURL);

    let res = await postMessageToQueue(UPDATE_QUEUE, UPDATE_JOB, {
      uniqueKey : key.uniqueKey
    },{ removeOnComplete: true, removeOnFail: true });


    ctx.body = {
      status: RESPONSE_SUCCESS,
      payload: key
    };


    return await next();
  } catch (er) {
  console.log(er);
  logger.error(`Something bad happen base exception occurred`, {er})
  next(er);
}


});

module.exports = router
