const Raven = require('raven');
const createLogger = require("./logging");
const logger = createLogger({
    component: "Sentry"
});

const network = require("./network");
const ipAddresses = network.getIPAddressesOfHostMachine();
const serverName = ipAddresses[ipAddresses.length - 1]

Raven.config(process.env.SENTRY_DSN, {
    name: serverName,
    environment: process.env.NODE_ENV
}).install();


const reportError = (err) => {

    return new Promise((resolve, reject) => {

        if (process.env.NODE_ENV === "development") {
            // Log locally
            console.log("======================================");
            console.log(
                "Hijacking sentry in development, dumping on console"
            );
            console.log("======================================");
            console.error(err);

            return resolve()
        }

        Raven.captureException(err, null, (sendErr, res) => {
            if (sendErr) {
                logger.error(sendErr)
                return reject(sendErr);
            }

            return resolve(res)

        })

    })


}

module.exports = {reportError};
