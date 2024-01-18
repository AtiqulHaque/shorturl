const createLogger = require("../../utils/logging");


const urlRepo = require("./../../repositories/urls");
const {getRedis} = require("../../utils/redis");

var md5 = require('md5');

module.exports.getUniqueID = async (longURL) => {

  try {

    const url = process.env.TOKEN;

    const data = {
      longURL: longURL
    };
    const customHeaders = {
      "Content-Type": "application/json",
    }

    let response = await fetch(url, {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify(data),
    });

    const res = await response.json()

    const {uniqueKey} = res.payload;

    return {
      "uniqueKey" : uniqueKey
    };
  } catch (err) {

    console.log(err);

    return {
      "status": "error",
      "data": "error"
    };
  }
}
