'use strict'

<<<<<<< HEAD
//기사 링크 전
=======
//https://media.daum.net
//기사 제목, 언론사, 뉴스 등록시간 - txt_info, 이미지 - img태그, 본문 내용표시
//화면에 보여줄 컨텐츠를 매일 특정 웹 영역을 통해 수집 저장

>>>>>>> dfca6dc68710be43c4e70856e25b82ceea6d7ca8
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