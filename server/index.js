'use strict'

//https://media.daum.net
//기사 제목, 언론사, 뉴스 등록시간 - txt_info, 이미지 - img태그, 본문 내용표시
//화면에 보여줄 컨텐츠를 매일 특정 웹 영역을 통해 수집 저장

const request = require('request');
let JSSoup = require('jssoup').default;
let ArrNewsTitle = [];      //기사제목
let ArrNewsComp = [];       //언론사
let ArrNewsLink = [];       //기사 본문 링크
let ArrNewsContent = [];    //기사 본문
let ArrNewsTime = [];       //뉴스 등록시간
let ArrReNewsTime = [];       //뉴스 수정시간
let ArrReporterName = [];       //기자이름
let ArrNewsImg = [];       //기자이름
let TitleLen = 25;         //추출 제목 갯수
let NewsLen = 24;          //본문 이동용 링크 갯수
let url = "https://media.daum.net/";
request.get(url, function(error,response,body){
    const soup = new JSSoup(body);
    let attrFinder = soup.findAll('a');
    for (let i=0; i<attrFinder.length; i++){
        if (attrFinder[i].attrs.class === "link_txt"){
            // if (ArrNewsTitle.length < 1){
                 console.info(attrFinder[i])
            // }
            ArrNewsTitle.push(attrFinder[i].text)
            if (ArrNewsTitle.length >TitleLen){
                break;
            }
            ArrNewsLink.push(attrFinder[i].attrs.href)
            if (ArrNewsLink.length > NewsLen){
                break;
            }
        }
    }
    let spanFinder = soup.findAll('span');
    for (let i=0; i<spanFinder.length; i++){
        if (spanFinder[i].attrs.class === "txt_view"){
            ArrNewsComp.push(spanFinder[i].text)
            if (ArrNewsComp.length > NewsLen){
                break;
            }
        }
    }
    for (let i=0; i< ArrNewsLink.length; i++){
        let contentUrl = ArrNewsLink[i];
        request.get(contentUrl, async function(error,response,body){
            //console.log(contentUrl);
            //console.log("======");
            //본문추출
            let contentSoup = new JSSoup(body);
            let SecFinder = contentSoup.findAll('section');
            let SpanFinder = contentSoup.findAll('span');
            let PFinder = contentSoup.findAll('p');
            for (let i=0; i<SecFinder.length; i++){
                    ArrNewsContent.push(SecFinder[i].text);
                    //console.log(SecFinder[i].text);
            }
            for (let i=0; i<SpanFinder.length; i++){
                if (SpanFinder[i].attrs.class === "txt_info"){
                    let temp = SpanFinder[i].text.split('\n').toString();
                    if (temp.indexOf('입력') != -1){
                        ArrNewsTime.push(temp); //기사 입력 시간
                    } else if (temp.indexOf('수정') != -1){
                        ArrReNewsTime.push(temp); //기사 수정 시간
                    } else {
                        ArrReporterName.push(temp); //기레기
                    }
                }
            }
            for (let i=0; i<PFinder.length; i++){
                if (PFinder[i].attrs.class === "link_figure"){
                    ArrNewsImg.push(PFinder[i].nextElement.attrs.src); //본문 내 이미지
                }
            }
            //console.log(ArrNewsImg);
        })
    }
});