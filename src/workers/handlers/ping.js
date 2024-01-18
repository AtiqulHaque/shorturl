const loggerFactory = require("../../utils/logging");

const logger = loggerFactory({
    worker: "ping",
});


module.exports = async (job) => {
    switch (job.name) {
        case "hello":
            await handlePing(job.data)
            break

        default:
            throw new Error("Invalid job name passed")

    }
};


const handlePing = async ({app}) => {
    logger.info("Saying hello from: " + app)
}

