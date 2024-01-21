const createLogger = require("../../utils/logging");

const {getRedis} = require("../../utils/redis");
const keyRepo = require("./../../repositories/key_repo");

var md5 = require('md5');

module.exports.getUniqueID = async (longURL) => {

  try {

    let keyword = await keyRepo.getKey();

    if(keyword.length > 0){

      await keyRepo.updateKeyword(keyword[0]['_id']);

      let key = keyword.pop();

      return {
        "uniqueKey" : key['key']
      };
    }

    return {
      "uniqueKey" : null
    };
  } catch (err) {

    console.log(err);

    return {
      "status": "error",
      "data": "error"
    };
  }
}
