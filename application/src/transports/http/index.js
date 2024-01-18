const {reportError} = require("../../utils/sentry");
const modules = require("./modules")


// Attach signal handlers
const signalHandler = (signal) => {
    return () => {
        console.log(`Shutting down: ${signal}`);
        process.exit();
    };
};
process.on("SIGTERM", signalHandler("SIGTERM"));
process.on("SIGINT", signalHandler("SIGINT"));

// Load app

const koa = require("./koa");
koa(modules).catch((err) => {
    console.error(err);
    reportError(err)
        .catch((err) => console.error(err));
    process.exit();
});
