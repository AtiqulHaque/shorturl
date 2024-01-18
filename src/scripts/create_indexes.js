const _ = require("lodash");

const {getDatabase} = require("../utils/database")


const singleIndexes = {
  urls: ["uniqueID"],
};

const compoundIndexes = {};

async function createCollections() {
    const db = await getDatabase();

    console.log("run...");

    const collectionNames = [
        ...new Set([
            ...Object.keys(singleIndexes),
            ...Object.keys(compoundIndexes),
        ]),
    ];

    const collectionsInDatabase = (await db.listCollections().toArray()) || [];
    const collectionNamesInDatabase = collectionsInDatabase.map(
        (collection) => collection.name
    );

    for (const collectionName of collectionNames) {
        if (_.includes(collectionNamesInDatabase, collectionName)) {
            console.log(`Collection exists: ${collectionName}`);
        } else {
            console.log(`Creating collection: ${collectionName}`);
            await db.createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
        }
    }
}

async function createSingleIndexes() {
    const db = await getDatabase();

    const collectionNames = Object.keys(singleIndexes);

    for (let i = 0; i < collectionNames.length; i++) {
        const coll = collectionNames[i];

        const targetIndexes = singleIndexes[coll];
        const existingIndexes = ((await db.collection(coll).indexes()) || []).map(
            (i) => Object.keys(i.key)[0]
        );
        const indexesToCreate = _.differenceWith(
            targetIndexes,
            existingIndexes,
            _.isEqual
        );

        if (indexesToCreate.length) {
            const indexes = indexesToCreate.map((index) => {
                return {name: index, key: {[index]: 1}};
            });
            console.log(
                `Creating indexes on collection ${coll}: ${JSON.stringify(
                    indexes
                )}`
            );
            await db.collection(coll).createIndexes(indexes);

            console.log(`Created indexes on collection ${coll}`);
        } else {
            console.log(`No new indexes needed for: ${coll}`);
        }
    }
}

async function createCompoundIndexes() {
    const db = await getDatabase();

    for (const [collection, indexes] of Object.entries(compoundIndexes)) {
        const existingIndexes = await db.collection(collection).indexes();
        const existingIndexNames = existingIndexes.map((obj) => obj.name);

        for (const {keys, options} of indexes) {
            if (!existingIndexNames.includes(options.name)) {
                console.log(
                    `Creating ${
                        options.name
                    } index on collection ${collection}: ${JSON.stringify(keys)}`
                );
                await db.collection(collection).createIndex(keys, options);

                console.log(
                    `Created ${options.name} index on collection ${collection}`
                );
            } else {
                console.log(
                    `${options.name} index already exists on ${collection}`
                );
            }
        }
    }
}

async function seedDatabase() {
    const db = await getDatabase();

}

function printHeader(text) {
    console.log(`${"-".repeat(5)}${text}${"-".repeat(5)}`);
}

async function run() {
    printHeader("Create Collections");
    await createCollections();

    printHeader("Create Single Indexes");
    await createSingleIndexes();

    printHeader("Create Compound Indexes");
    await createCompoundIndexes();

    printHeader("Seed Database");
    await seedDatabase();
}


run()
    .then(() => process.exit())
    .catch((e) => console.error(e));
