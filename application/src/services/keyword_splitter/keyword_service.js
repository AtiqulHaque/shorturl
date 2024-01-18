const WordsSplitter = require('./WordsSplitter');

const createLogger = require("../../utils/logging");

const WordsNinja = new WordsSplitter();

const keywordRepo = require("./../../repositories/keyword_repo");
const {getRedis} = require("../../utils/redis");


(async () => {
  await WordsNinja.loadDictionary(); // First load dictionary
  console.log("\nDictionary has been loaded successfully...");
  console.log("\nSystem ready to parse word..");
})();


module.exports.split = async (keyword) => {

  try{

    let splitData =  WordsNinja.splitSentence(keyword,{
      camelCaseSplitter: false,  // Frist camel case spliting
      capitalizeFirstLetter: false,  // Capitalize first letter of result
      joinWords: true  // Join words
    });

    return{
     "status" : "success",
      "data": splitData
    };
  } catch (err) {
    return{
      "status" : "error",
      "data": "error"
    };
  }

}


module.exports.updateMapping = async (id, keyword, mapping) => {

  try {
     const redis = getRedis();

    let dbResponse = await keywordRepo.updateMapping(id, mapping);

    const isHashExists = await redis.hexists(keyword, "count");

    if (isHashExists === 1) {
        redis.hset(keyword, "mapping", mapping);
    }

    return{
     "status" : "success",
      "data": dbResponse
    };

  } catch (err) {

    return{
      "status" : "error",
      "data": "error"
    };
  }

}

module.exports.updateStatus = async (id, keyword, status) => {

  try {
     const redis = getRedis();

    let dbResponse = await keywordRepo.updateStatus(id, status);

    const isHashExists = await redis.hexists(keyword, "count");

    if (isHashExists === 1) {
        redis.hset(keyword, "status", parseInt(status));
    }

    return{
     "status" : "success",
      "data": dbResponse
    };

  } catch (err) {

    return{
      "status" : "error",
      "data": "error"
    };
  }

}

module.exports.addKeyword = async (keyword, split) => {

  try {
    const redis = getRedis();

    let actual_keyword = keyword;

    let hashKey = keyword.replace(/\s/g, '').toLowerCase()

    const isHashExists = await redis.hexists(hashKey, "count");

    if (isHashExists === 1) {
      return {
        "status": "exists",
        "data": "Keyword already exists"
      };
    }

    let dbResponse = await keywordRepo.addKeyword(hashKey, actual_keyword, 1, split);

    if (typeof dbResponse != "undefined" && typeof dbResponse.insertedId != "undefined") {

      redis.hset(hashKey, "split", split);
      redis.hset(hashKey, "actual_keyword", actual_keyword);
      redis.hset(hashKey, "mapping", null);
      redis.hset(hashKey, "count", 1);

      return {
        "status": "success",
        "data": dbResponse
      };
    }


  } catch (err) {

    console.log(err);

    return {
      "status": "error",
      "data": "error"
    };
  }
}

module.exports.isKeywordExists = async (keyword) => {

  try {

    let dbResponse = await keywordRepo.getByKeyword(keyword);

    if(dbResponse.length > 0){
      return{
        "status" : "success",
        "data": dbResponse
      };
    } else {
      return{
        "status" : "empty",
        "data": []
      };
    }



  } catch (err) {
    console.log(err);
    return{
      "status" : "empty",
      "data": []
    };
  }

}

