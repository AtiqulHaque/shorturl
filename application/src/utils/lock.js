const redis = require("./redis");

class Lock {
  constructor(key) {
    this.key = `lock:${key}`;
  }

  async acquire(ex = 60) {
    const redisClient = redis.getRedis();
    const result = await redisClient.set(this.key, new Date(), "EX", ex, "NX");

    if (!result) {
      throw new Error(`Failed to acquire lock for: ${this.key}`);
    }
    return result;
  }

  async unlock() {
    const redisClient = await redis.getRedis();
    return redisClient.del(this.key);
  }
}

module.exports = Lock;
