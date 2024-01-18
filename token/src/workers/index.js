const path = require("path")

const {QUEUE_CONFIGURATIONS} = require("./config")
const {getWorker} = require("../utils/bullmq")
const {reportError} = require("../utils/sentry")


for (const [queueName, options] of Object.entries(QUEUE_CONFIGURATIONS)) {
    const processorFile = path.join(__dirname, "handlers", queueName);
    const worker = getWorker(queueName, processorFile, options)

    worker.on('error', err => {
        reportError(err).catch((err) => console.error(err));
    });

    worker.on("completed", (job, error) => {
      job.remove().catch((err) => console.error(err));
    });

    worker.on("failed", (job, error) => {
      job.remove().catch((err) => console.error(err));

      reportError(error).catch((err) => console.error(err));
    });
    worker.on('failed', (job, err) => {
        reportError(err).catch((err) => console.error(err));
    });

    worker.run()
}
