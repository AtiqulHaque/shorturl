const loggerFactory = require("../../utils/logging");
const keywordRepo = require("./../../repositories/keyword_repo")
const logger = loggerFactory({
    worker: "insert_keyword",
});


module.exports = async (job) => {
    switch (job.name) {
        case "insert_keyword":
            await handlePing(job.data)
            break

        default:
            throw new Error("Invalid job name passed")

    }
};


const handlePing = async (data) => {
    await keywordRepo.insertKeyword(data.keyword, data.actual_keyword, data.split, data.count, data.mapping);
}

