const ObjectId = require('mongodb').ObjectId;

const {REDIS_COUNT, REDIS_KEY_STATUS} = require("../constants/keyword");
const {getRedis} = require("../utils/redis");
const {KEYWORD_COLLECTION} = require("../config/keyword");
const {getDatabase} = require("../utils/database")

function printHeader(text) {
    console.log(`${"-".repeat(5)}${text}${"-".repeat(5)}`);
}

async function run() {
    printHeader("Load Keyword Collections");
  const db = await getDatabase();
  const redis = await getRedis();


 // let searchQuery ={ "status" : {$eq: null}};


  let allKeywords =  await db.collection(KEYWORD_COLLECTION)
    .find()
    .toArray();


  for(let i = 0; i < allKeywords.length; i++){
    const cachedData = await redis.hgetall(allKeywords[i].keyword);
    if(cachedData.mapping.length > 0 && allKeywords[i].mapping.length > 0){
      redis.hset(allKeywords[i].keyword, REDIS_KEY_STATUS, 1);
      await db.collection(KEYWORD_COLLECTION).updateOne({_id: ObjectId(allKeywords[i]._id)},
        {$set: {status: 1}}
      );
    }else{
      redis.hdel(allKeywords[i].keyword, REDIS_KEY_STATUS);
    }


    console.log(i);
  }

}


run()
    .then(() => process.exit())
    .catch((e) => console.error(e));
