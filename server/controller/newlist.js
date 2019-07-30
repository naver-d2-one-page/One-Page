let express  = require('express');
let router   = express.Router();

const dbcon = require('../db_connect');
let con = dbcon()
con.connect()
findcount = (table) => {
  con.query('select count(link) as count from '+ table, (error, results) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results.count)
    return results.count
  });
}
// IT 테이블 긁어오기
router.get('/it',  function(req,res){
    let count = req.query.count
    const realcount = findcount('it')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select title,link from IT order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(results.data)
        return res.json(results)
      });
});

//사회 테이블 긁어오기
router.get('/society',  function(req,res){
    let count = req.query.count
    const realcount = findcount('society')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select link from society order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 경제 테이블 긁어오기
router.get('/economy',  function(req,res){
    let count = req.query.count
    const realcount = findcount('economy')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select link from economy order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 정치 테이블 긁어오기
router.get('/polity',  function(req,res){
    let count = req.query.count
    const realcount = findcount('polity')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select link from polity order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 생활/문화 테이블 긁어오기
router.get('/living',  function(req,res){
    let count = req.query.count
    const realcount = findcount('living')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select link from living order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});

// 세계뉴스 테이블 긁어오기
router.get('/world',  function(req,res){
    let count = req.query.count
    const realcount = findcount('world')
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select link from world order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        return res.json(results)
      });
});
module.exports= router