'use strict'

//기사 링크 전
const request = require('request');
let JSSoup = require('jssoup').default;
let ArrNewsLink = [];       //기사 본문 링크
let url = "https://news.naver.com/";
request.get(url, function(error,response,body){
    let soup = new JSSoup(body);
    let ulFinder = soup.findAll('ul');
    for (let i=0; i<ulFinder.length; i++){
        if (ulFinder[i].attrs.class === "mlist2 no_bg"){
            for (let j=0; j<ulFinder[i].contents.length; j++){
                let temp = ulFinder[i].contents[j].nextElement.attrs.href;
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=100&','tool/print.nhn?');
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=101&','tool/print.nhn?');
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=102&','tool/print.nhn?');
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=103&','tool/print.nhn?');
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=104&','tool/print.nhn?');
                temp = temp.replace('read.nhn?mode=LSD&mid=shm&sid1=105&','tool/print.nhn?');
                ArrNewsLink.push(temp) //기사 본문 링크
            }
        }
    }
    ArrNewsLink.forEach(a => {
        console.log(a)
    })
});