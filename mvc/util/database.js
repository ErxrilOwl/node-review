const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async (callback) => {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB!');
        _db = client.db();
        callback(client);
    } catch(err) {
        console.error('MongoDB connection failed: ', err);
        throw err;
    };
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized!');
    }
    return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
