const {getRedis} = require("./redis")

const {Worker, Queue} = require("bullmq")


module.exports.postMessageToQueue = async (queueName, jobName, data, options) => {
    const queue = new Queue(queueName, {connection: getRedis()})
    await queue.add(jobName, data, options)
    await queue.close()
}

module.exports.getWorker = (queueName, processorFile, options) => {
    return new Worker(queueName, processorFile, {connection: getRedis(), autorun: false, ...options},);

}