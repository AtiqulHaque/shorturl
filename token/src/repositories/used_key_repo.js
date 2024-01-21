const {getDatabase} = require("../utils/database");
const {USED_KEY_COLLECTION} = require("../config/keyword");
const loggerFactory = require("../utils/logging");
const ObjectId = require('mongodb').ObjectId;
const logger = loggerFactory({
  worker: "insert_keyword",
});


module.exports.insertUsedKey = async (key) => {

  try {
    const database = await getDatabase();

    return await database.collection(USED_KEY_COLLECTION).insertOne({
      key,
      created_at: new Date(),
      updated_at: new Date(),
    });

  } catch (e) {
    logger.info("Error found in add url repo: " + e)
  }

};

module.exports.shiftKey= async () => {

  try {

    const database = await getDatabase();

    return await database.collection(USED_KEY_COLLECTION)
      .find({"isUsed" : 1})
      .limit(100);

  } catch (e) {
    logger.info("Error found in  get by keyword data  repo: " + e)
  }

  return [];

};
