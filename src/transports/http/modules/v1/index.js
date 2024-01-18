const Router = require("@koa/router");
const router = new Router({prefix: "/v1"});

const homeRouter = require("./home")

router.use(homeRouter.routes()).use(homeRouter.allowedMethods());

module.exports = router