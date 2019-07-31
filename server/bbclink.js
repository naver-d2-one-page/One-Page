'use strict'
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio')
const moment = require('moment');
const mysql = require('mysql');
require('dotenv').config();
let date = moment().format('YYYY-MM-DD HH:mm:ss'); 
// require('moment-timezone'); 
let category = ["정치","경제","사회","생활/문화","세계","IT/과학"]
let dbcategory = ["polity","economy","society","living","world","IT"]
let url = "https://www.msn.com/ko-kr/news";
let requestOptions = { method: "GET" , 
                       uri: url ,
                       headers: { "User-Agent": "Mozilla/5.0" } ,
                       encoding: null }; 
let dbconnect = () => { 
    let connection =  mysql.createConnection({
        host: '106.10.53.225',
        port: 3306,
        user: 'root',
        password: 'dnrxo`1`1',
        database: 'd2'
    });
    return connection
}
let dbinsert = (con,title,link,currentime) => {
    con.query('insert into popular_in_bbc values(?,?,?,?,?)', [0,"bbc", title,link,currentime], function (err, rows, fields) {
        if (!err) {
            console.log("success")
        } else {
            console.log('err : ' + err)
        }
    });
}


request.get(url, function(error,response,body){
    let con = dbconnect()
    con.connect()
    // let tempbody = Buffer.from(body)   
 	// let strContents = iconv.decode(tempbody, 'EUC-KR').toString();
    let $ = cheerio.load(body)
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    // const dom = domParser.parseFromString(body, `text/html`)
    // console.log(dom)
    global.document = new JSDOM(body).window.document

    const aa = global.document.querySelectorAll(`[id*=world-headingtext]`)
    console.log(aa)
    // let ulFinder = $("[id*=world-headingtext]").next();
    // let ulFinder = $("[id*=world-headingtext]");
    // console.log(ulFinder.html())
    // console.log(ulFinder.html())
    
    // let totallen= ulFinder.prevObject.length //30개
    // console.log(totallen)
    // let date = (new Date()).toJSON().slice(0, 19).replace(/[T]/g, ' ')
    // console.log(date)
    con.end()
    
});