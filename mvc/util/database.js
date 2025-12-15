// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_complete',
//     password: ''
// });

// module.exports = pool.promise();

// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('node_complete', 'root', '', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://node_db_user:XVXUqEbXz00ABF0I@node-review-cl.4lyttfg.mongodb.net/?appName=node-review-cl'
    ).then(client => {
        console.log('Connected!');
        callback(client);
    }).catch(err => {
        console.log(err);
    });
};

module.exports = mongoConnect;