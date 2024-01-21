const ObjectId = require('mongodb').ObjectId;

const {REDIS_COUNT, REDIS_KEY_STATUS} = require("../constants/keyword");
const {getRedis} = require("../utils/redis");
const {KEY_COLLECTION} = require("../config/keyword");
const {getDatabase} = require("../utils/database")
var md5 = require('md5');
function printHeader(text) {
    console.log(`${"-".repeat(5)}${text}${"-".repeat(5)}`);
}

async function run() {
    printHeader("Start Generate keys into DB");
  const db = await getDatabase();
  const redis = await getRedis();

  let count = null;
  let data = null;
  let buff = null;
  let base64data = null;

  await redis.del("keycount");

  while(true){
      await redis.incr("keycount");
      count = await redis.get("keycount");
      data = md5(count).substring(0, 8);
      buff = new Buffer(data);
      base64data = buff.toString('base64');

      await db.collection(KEY_COLLECTION).insertOne({
        "key" : base64data.substring(4,14),
        "isUsed" : 0
      });

      if(count >= 10000){
        break;
      }


  }


}


run()
    .then(() => process.exit())
    .catch((e) => console.error(e));
