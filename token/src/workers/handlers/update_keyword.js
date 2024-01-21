const loggerFactory = require("../../utils/logging");
const usedKeyRepo = require("./../../repositories/used_key_repo")
const keyRepo = require("./../../repositories/key_repo")


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

  console.log("Queue received ...", data);

  await usedKeyRepo.insertUsedKey(data.uniqueKey);

  await keyRepo.removeKey(data.uniqueKey);

  console.log("Queue process finish ...", data);
}

