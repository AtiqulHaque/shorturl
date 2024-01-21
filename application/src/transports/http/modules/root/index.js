const Router = require("@koa/router");
const { getRedis } = require("../../../../utils/redis");
const { getDatabase } = require("../../../../utils/database");
const router = new Router();

const BASE_URL = process.env.BASE_URL;

router.get("/", async (ctx, next) => {
  const redisConnection = await getRedis();
  const redisPingResponse = await redisConnection.ping();

  if (redisPingResponse !== "PONG") {
    throw new Error("Redis ping failed");
  }

  const mongoDatabase = await getDatabase();
  const mongoPingResponse = await mongoDatabase.admin().ping();

  if (!mongoPingResponse.ok) {
    throw new Error("Mongo ping failed");
  }

  ctx.body = {
    docs: `${BASE_URL}/docs`,
  };
  return await next();
});


router.get("/health", async (ctx, next) => {

  ctx.body = "Ok";

  return await next();
});
module.exports = router;
