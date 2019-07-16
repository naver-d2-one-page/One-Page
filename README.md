# One-Page

[![Build Status](https://travis-ci.org/naver-d2-one-page/One-Page.svg?branch=master)](https://travis-ci.org/naver-d2-one-page/One-Page) [![codebeat badge](https://codebeat.co/badges/77d06d94-412c-462f-96bd-66ce9f6e24c1)](https://codebeat.co/projects/github-com-naver-d2-one-page-one-page-master) ![GitHub](https://img.shields.io/github/license/naver-d2-one-page/One-Page.svg) ![Website](https://img.shields.io/website/https/op-news.web.app/main.svg) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/naver-d2-one-page/One-Page.svg)

## 네이버 D2 출품작

- 설명: 초대형 모니터에 적합한 기사 배열 만들기 

## 저장소 클론하기
* 깃 저장소를 로컬에 복사합니다.
```bash
git clone https://github.com/naver-d2-one-page/One-Page.git 프로젝트명
cd 프로젝트명
```
## 빌드하기

* npm 패키지를 설치하고, 빌드 스크립트를 실행합니다.
```bash
npm install
```

* 아래와 같은 폴더가 생성됩니다.
```
📦client
 ┣ 📂.storybook
 ┃ ┗ 📜config.js *storybook.js UI 테스트 config
 ┣ 📂functions *firebase 서버리스 함수 모음
 ┃ ┣ 📜.eslintrc.js
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜index.js
 ┃ ┗ 📜package.json
 ┣ 📂public *호스팅 Public 폴더
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂css
 ┃ ┃ ┃ ┗ 📜foundation.min.css *foundation 프레임워크 css
 ┃ ┃ ┗ 📂img
 ┃ ┃ ┃ ┗ 📜logo.png
 ┃ ┣ 📜index.css *Init CSS
 ┃ ┗ 📜index.html *Init HTML
 ┣ 📂src
 ┃ ┣ 📂components *View - 재사용 컴포넌트 모음
 ┃ ┃ ┗ 📜page-main.js
 ┃ ┣ 📂libs
 ┃ ┃ ┣ 📜actions.js *Controller - 전체 Action 모음
 ┃ ┃ ┣ 📜litRender.js *lit-html sub module
 ┃ ┃ ┣ 📜redux-zero.js *redux-zero module
 ┃ ┃ ┗ 📜store.js *Model - Store
 ┃ ┣ 📂stories						
 ┃ ┃ ┗ 📜index.stories.js *UI 테스트 코드 모음
 ┃ ┗ 📜main.js *Init JS
 ┣ 📂test
 ┃ ┗ 📜index.html *단위 테스트 코드
 ┣ 📜.babelrc *Babel 설정
 ┣ 📜.codebeatignore
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.js *EsLint 설정
 ┣ 📜.firebaserc
 ┣ 📜.gitignore
 ┣ 📜database.rules.json
 ┣ 📜firebase.json *Firebase 설정
 ┣ 📜firestore.indexes.json
 ┣ 📜firestore.rules
 ┣ 📜package-lock.json
 ┣ 📜package.json *Package.json 설정
 ┣ 📜postcss.config.js
 ┣ 📜README.md *README
 ┣ 📜storage.rules
 ┣ 📜wct.conf.json
 ┗ 📜webpack.config.js *Webpack 설정
📦server
 ┗ 생성 중
📜.travis.yml *Travis CI 설정
```

## 테스트하기

* 개발과정 테스트
```bash
# client 폴더로 이동
cd client

# webpack-dev-server 실행
npm run dev
# 이후, localhost:9000 에서 웹서비스 확인

# UI 테스트
npm run storybook
# 이후, localhost:9001 에서 페이지/컴포넌트별 테스팅
```

* 배포 전 테스트
```bash
# Travis CI 자동 Build 검사
# 단위 테스트
npm test
```

## 배포하기
```bash
# Develop 버전 배포
npm run bundle

# Production 버전 배포
npm run production

## main-bundle.js 생성 후, server에서 구동
## (이후, 파이어베이스에서 사용할 예정)
```

## 기타

다른 세부사항은 `WIKI` 및 `Projects` 패널 참조
