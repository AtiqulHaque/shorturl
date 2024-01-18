const {getDatabase} = require("../utils/database");
const {KEYWORD_COLLECTION} = require("../config/keyword");
const loggerFactory = require("../utils/logging");
const ObjectId = require('mongodb').ObjectId;
const logger = loggerFactory({
  worker: "insert_keyword",
});

const paginate = require('./../utils/paginate');


module.exports.updateKeyword = async (keyword) => {

  try {
    const database = await getDatabase();

    let keywordData = await database.collection(KEYWORD_COLLECTION).find({keyword}).toArray();

    if (keywordData.length !== 0) {
      await database.collection(KEYWORD_COLLECTION).update({_id: ObjectId(keywordData[0]._id)},
        {
          $inc: {count: 1},
          $set : {
            "updated_at" : new Date()
          }
        }
      );
    }
  } catch (e) {
    logger.info("Error found in update keyword repo: " + e)
  }

};


module.exports.insertKeyword = async (keyword, actual_keyword, split, count, mapping) => {

  try {
    const database = await getDatabase();

    await database.collection(KEYWORD_COLLECTION).insertOne({
      keyword,
      actual_keyword,
      split,
      count,
      mapping,
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (e) {
    logger.info("Error found in update keyword repo: " + e)
  }

};


module.exports.updateMapping = async (id, mapping,) => {

  try {
    const database = await getDatabase();

    return await database.collection(KEYWORD_COLLECTION).updateOne({_id: ObjectId(id)},
      {$set: {mapping: mapping}}
    );

  } catch (e) {
    logger.info("Error found in keyword repo: " + e)
  }

};


module.exports.updateStatus = async (id, status) => {

  try {
    const database = await getDatabase();

    return await database.collection(KEYWORD_COLLECTION).updateOne({_id: ObjectId(id)},
      {$set: {status: parseInt(status)}}
    );

  } catch (e) {
    logger.info("Error found in keyword repo: " + e)
  }

};


module.exports.addKeyword = async (keyword, actual_keyword, count, split, mapping = null) => {

  try {
    const database = await getDatabase();

    return await database.collection(KEYWORD_COLLECTION).insertOne({
      keyword,
      actual_keyword,
      split,
      count,
      mapping,
      created_at: new Date(),
      updated_at: new Date(),
    });

  } catch (e) {
    console.log(e);
    logger.info("Error found in keyword repo: " + e)
    return null;
  }

};


module.exports.allKeyword = async (status = null, search = "", offset, offsetlimit) => {

  try {
    const database = await getDatabase();
    let date_ob1 = new Date();
    let date_ob = new Date();
    date_ob1.setDate(date_ob.getDate() - 7);

    const {page, limit} = paginate(offset, offsetlimit);

    let searchQuery = {};

    if (search.length > 0) {
      searchQuery["keyword"] = {
        '$regex': search.replace(/\s/g, '').toLowerCase(),
        '$options': 'i'
      };
    }

    if (status !== null) {
      searchQuery["status"] = parseInt(status);
    } else {
      searchQuery["status"] = {$eq: null};
      searchQuery["updated_at"] = {$gte: date_ob1};
    }

    return await database.collection(KEYWORD_COLLECTION)
      .find(searchQuery)
      .sort({"count": -1})
      .skip(page)
      .limit(limit)
      .toArray();
  } catch (e) {
    console.log(e);
  }

};


module.exports.countAll = async (status = null, search = "", offset, offsetlimit) => {

  try {
    const database = await getDatabase();

    let date_ob1 = new Date();
    let date_ob = new Date();

    date_ob1.setDate(date_ob.getDate() - 7);

    let searchQuery = {};

    if (search.length > 0) {
      searchQuery["keyword"] = search;
    }

    if (status !== null) {
      searchQuery["status"] = parseInt(status);
    } else {
      searchQuery["status"] = {$eq: null};
      searchQuery["created_at"] = {$gte: date_ob1};
    }

    return await database.collection(KEYWORD_COLLECTION)
      .find(searchQuery)
      .count();

  } catch (e) {
    console.log(e);
  }
};

module.exports.getByKeyword = async (keyword) => {

  try {

    const database = await getDatabase();
    return await database.collection(KEYWORD_COLLECTION)
      .find({keyword})
      .limit(1)
      .toArray();

  } catch (e) {
    logger.info("Error found in  get by keyword data  repo: " + e)
  }

  return [];

};



