const createLogger = require("../../utils/logging");

const {STATS_QUEUE, STATS_JOB} = require("./../../constants/keyword")
const urlRepo = require("./../../repositories/urls");
const {getRedis} = require("../../utils/redis");

const uniqueService = require('../../../src/services/unique_id/unique_id_service')
const {postMessageToQueue} = require("../../utils/bullmq");

module.exports.addURL = async (longURL) => {

  try {

    let {uniqueKey} = await uniqueService.getUniqueID(longURL);

    let uniqueIdResponse = await urlRepo.uniqueIDExists(uniqueKey);

    if(uniqueIdResponse.length > 0){
      return {
        "status": "success",
        "data": uniqueKey
      };
    }


    let dbResponse = await urlRepo.insertURL(longURL, uniqueKey, "1234", 30, "active");


    if(typeof dbResponse.acknowledged  !==  "undefined" && dbResponse.acknowledged){

      let insertResult = await urlRepo.getById(dbResponse.insertedId);

      return {
        "status": "success",
        "data": insertResult.uniqueID
      };

    }

    return {
      "status": "error",
      "data": null
    };


  } catch (err) {

    console.log(err);

    return {
      "status": "error",
      "data": "error"
    };
  }
}



module.exports.getURL = async (uniqueID) => {

  try {

    const redis = getRedis();

    let key = 'key' + uniqueID;

    let result = await redis.get(key);

    if(result){
      console.log(key + " : cache HIT");

      const parseData = JSON.parse(result);

      await postMessageToQueue(STATS_QUEUE, STATS_JOB, {
        stats : parseData
      },{ removeOnComplete: true, removeOnFail: true });

      return{
        "status" : "success",
        "data": parseData
      };
    } else {
      let dbResponse = await urlRepo.getUrl(uniqueID);

      console.log(key + " : cache MISS");


      if(dbResponse){
        await postMessageToQueue(STATS_QUEUE, STATS_JOB, {
          stats : dbResponse
        },{ removeOnComplete: true, removeOnFail: true });

        await redis.set(key, JSON.stringify(dbResponse));
        return{
          "status" : "success",
          "data": dbResponse
        };
      } else {
        return{
          "status" : "error",
          "data": null
        };
      }
    }


  } catch (err) {
    console.log(err);
    return{
      "status" : "empty",
      "data": []
    };
  }

}
