

const mysql = require('mysql');
require('dotenv').config();

let dbconnect = () => { 
    let connection =  mysql.createConnection({
        host: "106.10.53.225",
        port: 3306,
        user: "root",
        password: "dnrxo`1`1",
        database: "d2"
    });
    return connection
}
module.exports = dbconnect;


//const dbcon = require('../db_connect');
//
