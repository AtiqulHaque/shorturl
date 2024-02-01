const Router = require("@koa/router");
const AddValidator = require("./../../../../services/url/validator/add_url_validator");
const { getRedis, getMemoryInMB } = require("../../../../utils/redis");
const { postMessageToQueue } = require("../../../../utils/bullmq");
const urlService = require("../../../../services/url/url_service");
const {
  RESPONSE_VALIDATION_ERROR,
  RESPONSE_SUCCESS,
  RESPONSE_ERROR,
  TYPE_OF_UNDEFINED,
} = require("./../../../../constants/keyword");

const createLogger = require("../../../../utils/logging");

const logger = createLogger({
  service: "Parse keyword",
});

const router = new Router();

router.get("/:url", async (ctx, next) => {
  try {
    let response = await urlService.getURL(ctx.params.url);

    if (
      typeof response.status !== TYPE_OF_UNDEFINED &&
      response.status === RESPONSE_SUCCESS
    ) {
      console.log("System Redirecting  from : " + response.data.longURL);

      ctx.redirect(response.data.longURL); // redirect to another page
      return await next();
    } else {
      ctx.body = {
        status: RESPONSE_ERROR,
        payload: "ERROR",
      };

      return await next();
    }
  } catch (er) {
    console.log(er);
    logger.error(`Something bad happen base exception occurred`, { er });
    next(er);
  }
});

router.post("/set/url", async (ctx, next) => {
  try {
    // Validate keyword before parse
    let validatorResponse = AddValidator(ctx.request.body);

    if (
      typeof validatorResponse.status !== TYPE_OF_UNDEFINED &&
      validatorResponse.status === RESPONSE_VALIDATION_ERROR
    ) {
      ctx.body = {
        status: RESPONSE_VALIDATION_ERROR,
        payload: validatorResponse.payload,
      };

      return await next();
    }

    let response = await urlService.addURL(
      validatorResponse.payload.longURL,
      validatorResponse.payload.split
    );

    console.log(response);

    if (
      typeof response.status !== TYPE_OF_UNDEFINED &&
      response.status === RESPONSE_SUCCESS
    ) {
      ctx.body = {
        status: RESPONSE_SUCCESS,
        payload: response.data,
      };
    } else {
      ctx.body = {
        status: RESPONSE_ERROR,
        payload: null,
      };
    }

    return await next();
  } catch (er) {
    console.log(er);
    logger.error(`Something bad happen base exception occurred`, { er });
    next(er);
  }
});

module.exports = router;
