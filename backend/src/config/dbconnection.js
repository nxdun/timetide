const mongoose = require('mongoose');
const Logger = require('./logger.js');
require('dotenv').config();
let database;

const connect = async () => {
    const uri = process.env.MONGOSTRING;
    if(database) return;

    mongoose.connect(uri)
    .then((connection) => {
        database = connection;
        Logger.info('Database connection established');
    })
    .catch((error) => {
        Logger.error(error);
    })

};


module.exports = connect;