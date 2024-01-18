const createLogger = require("../../utils/logging");


const urlRepo = require("./../../repositories/urls");
const {getRedis} = require("../../utils/redis");

var md5 = require('md5');

module.exports.getUniqueID = async (longURL) => {

  try {
    return {
      "uniqueKey" : md5(longURL).substring(0, 8)
    };
  } catch (err) {

    console.log(err);

    return {
      "status": "error",
      "data": "error"
    };
  }
}
