'use strict'

//https://media.daum.net
//기사 제목, 언론사, 뉴스 등록시간 - txt_info, 이미지 - img태그, 본문 내용표시
//화면에 보여줄 컨텐츠를 매일 특정 웹 영역을 통해 수집 저장
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio')
const moment = require('moment');
const mysql = require('mysql');
let date = moment().format('YYYY-MM-DD HH:mm:ss'); 
// require('moment-timezone'); 
let category = ["정치","경제","사회","생활/문화","세계","IT/과학"]
let dbcategory = ["polity","economy","society","living","world","IT"]
let url = "https://news.naver.com/";
let requestOptions = { method: "GET" , 
                       uri: url ,
                       headers: { "User-Agent": "Mozilla/5.0" } ,
                       encoding: null }; 
let dbconnect = () => { 
    let connection =  mysql.createConnection({
        host: '106.10.53.225',
        post: 3306,
        user: 'root',
        password: 'dnrxo`1`1',
        database: 'd2'
    });
    return connection
}
let dbinsert = (con,category,title,link,currentime) => {
    con.query('insert into '+dbcategory[category]+' values(?,?,?,?,?)', [0,category, title,link,currentime], function (err, rows, fields) {
        if (!err) {
            console.log("success")
        } else {
            console.log('err : ' + err)
        }
    });
}


request.get(requestOptions, function(error,response,body){
    let con = dbconnect()
    con.connect()
    let tempbody = Buffer.from(body)   
 	let strContents = iconv.decode(tempbody, 'EUC-KR').toString();
    let $ = cheerio.load(strContents)
    let ulFinder = $('.no_bg');
    let totallen= ulFinder.children().length //30개
    let categorylen = totallen/6
    for (let i=0; i<6; i++){    
        console.log(category[i])
        for (let j=0; j<categorylen; j++){
            let url = ulFinder.children().eq((5*i+j)).children('a').attr('href')
            let title = ulFinder.children().eq((5*i+j)).children().find("strong").text()
            url = url.replace('read.nhn?mode=LSD&mid=shm&sid1=10'+i+'&','tool/print.nhn?');
            console.log(title);
            console.log(url);

            console.log("\n")
            dbinsert(con,i,title,url,date)
            
        }
        console.log("\n\n\n")
    }
    // let date = (new Date()).toJSON().slice(0, 19).replace(/[T]/g, ' ')
    // console.log(date)
    con.end()
    
});