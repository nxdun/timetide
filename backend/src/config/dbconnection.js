/*
*       This file is responsible for connecting to the MongoDB database.
*       Returns a connection object if the connection is successful.
*       Logs an error if the connection fails..
*/

const mongoose = require('mongoose');
const Logger = require('./logger.js');
require('dotenv').config();
let database;

const connect = async () => {
    const uri = process.env.MONGOSTRING_TEST;
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