let express  = require('express');
let router   = express.Router();

const dbcon = require('../db_connect');
let con = dbcon()
// let Order     = require('../models/order');//  우리가 정의해야할 디비 모델 임포트해야하고
con.connect()
// IT 테이블 긁어오기
router.get('/it',  function(req,res){
    con.query('select link from IT', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

//사회 테이블 긁어오기
router.get('/society',  function(req,res){
    con.query('select link from society', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 경제 테이블 긁어오기
router.get('/economy',  function(req,res){
    con.query('select link from economy', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 정치 테이블 긁어오기
router.get('/polity',  function(req,res){
    con.query('select link from polity', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 생활/문화 테이블 긁어오기
router.get('/living',  function(req,res){
    con.query('select link from living', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 세계뉴스 테이블 긁어오기
router.get('/world',  function(req,res){
    con.query('select link from world', (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});
module.exports= router