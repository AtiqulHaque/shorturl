const {postMessageToQueue} = require("../../utils/bullmq")
const loggerFactory = require("../../utils/logging");
const {reportError} = require("../../utils/sentry")

const logger = loggerFactory({
  cron: "ping",
});


const SCHEDULE = {
  minute: "1"
};

const task = async () => {
  logger.info("Queue: ping");
  await postMessageToQueue("ping", "hello", {app: "ls-app"})
  return "done";
};

const onComplete = (response) => {
  logger.info("Queue result: " + response);
};

const onError = (err) => {
  reportError(err).catch((err) => console.error(err));
};

module.exports = {
  id: "ping",
  schedule: SCHEDULE,
  task,
  onComplete,
  onError,
};
