const cron = require("node-cron");

const jobs = require("./jobs");
const utils = require("./utils");
const Lock = require("../utils/lock");
const {format} = require("date-fns");

const cronDefaultOptions = {}
const devTimezone = process.env.DEV_TIMEZONE

if (devTimezone) {
  cronDefaultOptions["timezone"] = devTimezone
  console.log("Cron Timezone: ", devTimezone)
}


for (const job of jobs) {
  const cronExpression = utils.convertToCronExpression(job.schedule);

  cron.schedule(
    cronExpression,
    () => {
      lockAndEnQueue(job).catch((err) => {
        console.error(err);
      });
    },
    {...cronDefaultOptions, ...job.options}
  );

  console.log(`Cron Schedule: ${job.id} => [ ${cronExpression} ]`)

}

module.exports = cron;

async function lockAndEnQueue(job) {
  if (!job.id) throw new Error("Invalid cron ID");

  const time = format(new Date(), "yyyy-MM-dd-HH-mm");
  const lockKey = `cron:${job.id}:${time}`;
  const lock = new Lock(lockKey);

  try {
    await lock.acquire();
  } catch (err) {
    return;
  }

  try {
    const response = await job.task();
    if (job.onComplete) {
      await job.onComplete(response);
    }
  } catch (err) {
    if (job.onError) {
      await job.onError(err);
    }
  }

  // await lock.unlock();
}
