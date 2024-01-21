const {getDatabase} = require("../utils/database");
const {KEY_COLLECTION} = require("../config/keyword");
const loggerFactory = require("../utils/logging");
const ObjectId = require('mongodb').ObjectId;
const logger = loggerFactory({
  worker: "insert_keyword",
});


module.exports.getKey= async () => {

  try {

    const database = await getDatabase();

    return await database.collection(KEY_COLLECTION)
      .find({"isUsed" : 0})
      .limit(1)
      .toArray();

  } catch (e) {
    logger.info("Error found in  get by keyword data  repo: " + e)
  }

  return [];

};


module.exports.updateKeyword = async (keyID) => {

  try {
    const database = await getDatabase();

    await database.collection(KEY_COLLECTION).update({_id: keyID},
      {
        $set : {
          "isUsed" : 1
        }
      }
    );

  } catch (e) {
    logger.info("Error found in update keyword repo: " + e)
  }

};

module.exports.removeKey = async (keyID) => {

  try {
    const database = await getDatabase();

    await database.collection(KEY_COLLECTION).deleteOne({key: keyID});

  } catch (e) {
    logger.info("Error found in update keyword repo: " + e)
  }

};




