const loggerFactory = require("../../utils/logging");
//const keywordRepo = require("./../../repositories/keyword_repo")


const logger = loggerFactory({
    worker: "stats_job",
});


module.exports = async (job) => {
    switch (job.name) {
        case "stats_job":
            await handleStats(job.data)
            break

        default:
            throw new Error("Invalid job name passed")

    }
};


const handleStats = async (data) => {

  console.log("Stats queue received...");
}

