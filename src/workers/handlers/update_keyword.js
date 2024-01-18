const loggerFactory = require("../../utils/logging");
const keywordRepo = require("./../../repositories/keyword_repo")


const logger = loggerFactory({
    worker: "update_keyword",
});


module.exports = async (job) => {
    switch (job.name) {
        case "update_keyword":
            await handleUpdateKeyword(job.data)
            break

        default:
            throw new Error("Invalid job name passed")

    }
};


const handleUpdateKeyword = async (data) => {
  await keywordRepo.updateKeyword(data.keyword, data.actual_keyword, data.split, data.count, data.mapping);

}

