const MongoClient = require("mongodb").MongoClient;

const mongoConnectionOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    appname: "ls-app",
};

let connection = null;

module.exports.getDatabase = async () => {
    if (!connection) {
        connection = await MongoClient.connect(process.env.MONGO_DSN, mongoConnectionOpts);
    }

    if (process.env.MONGO_TEST_DB_NAME) {
        return connection.db(process.env.MONGO_TEST_DB_NAME);
    }

    return connection.db();
};
