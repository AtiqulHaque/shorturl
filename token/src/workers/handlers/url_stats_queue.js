const loggerFactory = require("../../utils/logging");
const statsRepos = require("../../repositories/key_stats")
const logger = loggerFactory({
    worker: "ping",
});


module.exports = async (job) => {
    switch (job.name) {
        case "stats_job":
            await handlePing(job.data)
            break

        default:
            throw new Error("Invalid job name passed")

    }
};


const handlePing = async (data) => {

  await statsRepos.insertStats(JSON.stringify(data.stats));

  console.log("Stats queue.. Saying hello from: " , data)
}

