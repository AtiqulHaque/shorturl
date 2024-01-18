const bcrypt = require("bcryptjs");
const uuid = require("uuid").v4;


const {getDatabase} = require("../utils/database");
const createLogger = require("../utils/logging")

const AUTHENTICATION_COLLECTION_NAME = "authentication"


module.exports.createUser = async (name, email, password) => {
    const database = await getDatabase();
    const user = await database.collection(AUTHENTICATION_COLLECTION_NAME).findOne({email});

    if (user) {
        throw new Error("User already exists");
    }

    const token = uuid();

    const newUser = {
        name,
        email,
        hash: bcrypt.hashSync(password, 12),
        token,

    };

    const result = await database.collection(AUTHENTICATION_COLLECTION_NAME).insertOne(newUser);

    return {
        name, email, token, _id: result.insertedId.toString()
    }

}

module.exports.verify = async (token) => {
    const database = await getDatabase();
    return await database.collection(AUTHENTICATION_COLLECTION_NAME).findOne({token});
}

module.exports.login = async (email, password) => {
    const database = await getDatabase();
    const user = await database.collection(AUTHENTICATION_COLLECTION_NAME).findOne({email});

    if (!user) {
        return false;
    }

    const verified = bcrypt.compareSync(password, user.hash);
    if (verified) {
        return user;
    }

    return false;
}
