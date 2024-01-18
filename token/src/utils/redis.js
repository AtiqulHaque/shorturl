const Redis = require("ioredis");


let CONNECTION = null;

module.exports.getRedis = function () {

    if (CONNECTION) {
        return CONNECTION;
    }

    CONNECTION = new Redis(process.env.REDIS_DSN);

    return CONNECTION;
};


module.exports.getMemoryInMB = () => {
  return new Promise((resolve, reject) => {
    this.getRedis().info((err, info) => {
      if (err) return reject(err)
      const used = info.split("\n").find(line => line.match(/used_memory/)).split(":")[1];
      return resolve(parseInt(used) / (1024 * 1024));
    })
  })
}
