# The-View Client
## 네이버 D2 출품작

- 설명: 초대형 모니터에 적합한 기사 배열 만들기 

## 저장소 클론하기
* 깃 저장소를 로컬에 복사합니다.
```bash
git clone https://github.com/naver-d2-the-view/The-View.git 프로젝트명
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
 ┃ ┗ 📜config.js (storybook.js UI 테스트 config)
 ┣ 📂src
 ┃ ┣ 📂components (View - 재사용 컴포넌트 모음)
 ┃ ┃ ┗ 📜page-main.js
 ┃ ┣ 📂css
 ┃ ┃ ┗ 📜foundation.min.css (foundation 프레임워크 css)
 ┃ ┣ 📂libs
 ┃ ┃ ┣ 📜actions.js (Controller)
 ┃ ┃ ┣ 📜litRender.js (lit-html sub module)
 ┃ ┃ ┣ 📜redux-zero.js (redux-zero module)
 ┃ ┃ ┗ 📜store.js (Store)
 ┃ ┣ 📂stories
 ┃ ┃ ┗ 📜index.stories.js (UI 테스트 코드)
 ┃ ┗ 📜main.js (Init 코드)
 ┣ 📂test
 ┃ ┗ 📜index.html (단위 테스트 코드)
 ┣ 📜.babelrc (바벨 설정)
 ┣ 📜.codebeatignore
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.js (EsLint 설정)
 ┣ 📜.gitignore
 ┣ 📜.travis.yml (Travis CI 설정)
 ┣ 📜index.css (전체 CSS)
 ┣ 📜index.html (전체 HTML)
 ┣ 📜package-lock.json
 ┣ 📜package.json (패키징 관리)
 ┣ 📜postcss.config.js
 ┣ 📜wct.conf.json
 ┗ 📜webpack.config.js (Webpack 설정)
📦server
 ┗ 생성 중
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