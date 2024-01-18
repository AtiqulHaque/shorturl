const json = require("koa-json");
const cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");


const createLogger = require("../../utils/logging");
const {reportError} = require("../../utils/sentry");

const Koa = require("koa");

const logger = createLogger({
    component: "Http",
});

module.exports = async (routers) => {
    const app = new Koa();

    loadMiddlewares(app);

    // Load the routes
    routers.forEach((router) => {
        app.use(router.routes()).use(router.allowedMethods())
    });

    // Start app
    const port = process.env.NODE_PORT || 9000;
    app.listen(port, () => {
        logger.info(`App started: http://0.0.0.0:${port}`);
    });
};

// Load middlewares
const loadMiddlewares = (app) => {
    // body parser
    app.use(bodyParser());
    // cors
    app.use(cors());
    // Log incoming requests summary
    app.use(async function loggger(ctx, next) {
        ctx.logger = logger;

        const result = await next();

        const responseBody = ctx.response.body;
        let response;

        try {
            response = JSON.parse(responseBody);
        } catch (e) {
            response = responseBody;
        }

        const requestContext = {
            project_name: ctx.project_name,
            method: ctx.request.method,
            url: ctx.request.url,
            status: ctx.response.status,
            request_id: ctx.request.id,
        };

        if (!ctx.disableResponseLog) {
            requestContext["response"] = response;
        }

        ctx.logger.info("Request Summary", requestContext);

        return result;
    });
    // Serve JSON
    app.use(json());

    // mount static path
    //app.use(mount("/static", serve("./static")));

    // generic error handler
    app.use(async function (ctx, next) {
        try {
            return await next();
        } catch (err) {
            ctx.logger.error(err.message);
            reportError(err)
                .catch((err) => console.error(err));

            ctx.body = {error: err.message};
            ctx.status = 500;
        }
    });
}
