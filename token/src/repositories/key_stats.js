const {getDatabase} = require("../utils/database");
const {KEY_STATS} = require("../config/keyword");
const loggerFactory = require("../utils/logging");
const ObjectId = require('mongodb').ObjectId;
const logger = loggerFactory({
  worker: "insert_keyword",
});


module.exports.insertStats = async (stats) => {

  try {
    const database = await getDatabase();

    return await database.collection(KEY_STATS).insertOne({
      "raw" : stats,
      created_at: new Date(),
      updated_at: new Date(),
    });

  } catch (e) {
    logger.info("Error found in add url repo: " + e)
  }

};
