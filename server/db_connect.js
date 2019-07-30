

const mysql = require('mysql');
require('dotenv').config();

let dbconnect = () => { 
    let connection =  mysql.createConnection({
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    return connection
}
module.exports = dbconnect;


//const dbcon = require('../db_connect');
//
