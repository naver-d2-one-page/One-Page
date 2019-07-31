let express  = require('express');
let router   = express.Router();

const dbcon = require('../db_connect');
let con = dbcon()
con.connect()
const findcount = (table) => {
  return new Promise(resolve => {
    con.query('select count(link) as count from '+ table, (error, results) => {
      if (error) {
        return console.error(error.message);
      }
      resolve(results[0].count)
      return results[0].count
    });
  })  
}
// IT 테이블 긁어오기
router.get('/it',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('it')
    const final_result = {result:[], count:0}
    if(!req.query.count || count > realcount){
      count = 10
    }
    con.query('select title,link from it order by no desc limit '+ count, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        results.forEach( data => {
          let title = data.title
          let link = data.link
          final_result.result.push({title:title, link:link})
        })
        final_result.count = count
        return res.json(final_result)
      });
});

//사회 테이블 긁어오기
router.get('/society',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('society')
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
router.get('/economy',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('economy')
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
router.get('/polity',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('polity')
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
router.get('/living',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('living')
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
router.get('/world',  async function(req,res){
    let count = req.query.count
    const realcount = await findcount('world')
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