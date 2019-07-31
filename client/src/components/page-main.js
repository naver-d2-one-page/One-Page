import { html } from 'lit-html'

import LitRender from '../libs/litRender'

import { loadCors, loadXhr } from '../libs/actions'

import './modal-news.js'

export class PageMain extends LitRender(HTMLElement) {
	constructor() {
		super()

		this._handlers = {}

		this.attachShadow({ mode: `open` })

		this.invalidate()
	}

	connectedCallback() {
		const root = this.shadowRoot
		const handlers = this._handlers

		handlers.onClick = this._onClick.bind(this)
		handlers.onKeydown = this._onKeydown.bind(this)
		
		root.addEventListener(`click`, handlers.onClick)
		root.addEventListener(`keydown`, handlers.onKeydown)
		this.resizePage()
		window.addEventListener(`resize`, () => {
			this.resizeThrottler()
		})
	}

	disconnectedCallback() {
		const root = this.shadowRoot

		root.removeEventListener(`click`, this._handlers.onClick)
		root.removeEventListener(`keydown`, this._handlers.onKeydown)
	}

	_onClick(event) {
		this.clickCategoryList(event)
		this.clickCategory(event)
		this.clickNewsView(event)
		this.clickList(event)
	}

	clickCategoryList(event) {
		if (event.target.classList.contains(`category-list`)) {
			event.target.classList.toggle(`active`)
		}
	}

	clickCategory(event) {
		if (event.target.classList.contains(`dropbtn`)) {
			// this.shadowRoot.querySelectorAll(`.category-list`).forEach(a => {				
			// 	a.classList.add(`active`)
			// })
			this.shadowRoot.querySelector(`.dropdown-content`).classList.toggle(`close`)
		}
	}

	clickNewsView(event) {
		const array = [`polity`, `economy`, `society`, `living`, `world`, `it`]
		const modal = this.shadowRoot.querySelector(`modal-news`)
		if (event.target.classList.contains(`category-submit`)) {
			modal._newsList = []
			this.shadowRoot.querySelectorAll(`.category-list`).forEach((li, index) => {
				if (li.classList.contains(`active`)) {
					this.loadCategory(array[index])
				}
			})					
		}
	}

	clickList(event) {
		const modal = this.shadowRoot.querySelector(`modal-news`)
		if (event.target.classList.contains(`search-link`)) {
			this.loadDom(`https://news.naver.com/main/tool/print.nhn?oid=${event.target.dataset.oid}&aid=${event.target.dataset.aid}`, false)
			modal.show()
		}
	}

	_onKeydown() {
		clearTimeout(window.keydownTimeout)
	
		window.keydownTimeout = setTimeout(() => {
			window.keydownTimeout = null
			this.loadSearchDB(this.shadowRoot.querySelector(`.type-url`).value)
		}, 200)
	}

	loadDom(url, isCategory = true) {
		loadCors(url, _html => {
			const modal = this.shadowRoot.querySelector(`modal-news`)
			const parser = new DOMParser()
			const doc = parser.parseFromString(_html, `text/html`)
			const _url = new URL(url)
			const host = _url.host
			
			modal.empty()
			this.switchURL(modal, host, _html, doc)
			
			if (isCategory) {
				modal.makeProgressBar(modal._categoryIndex)	
			}			
		})
	}

	loadCategory(category) {
		loadXhr(`https://cors.kro.kr/api/${category}`, res => {
			const modal = this.shadowRoot.querySelector(`modal-news`)
			const json = JSON.parse(res)
			// console.log(json)
			const obj = {}
			obj[category] = json
			modal._newsList.push([category, json])
			if (modal.style.display === `none`) {
				this.loadDom(modal._newsList[0][1][`result`][0][`link`])
				modal.show()
				modal.setIntervalPage()				
			}
		})
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(() => resolve(), ms))
	}

	loadSearchDB(searchText = ``) {
		const ul = this.shadowRoot.querySelector(`.search-text`)
		if (!searchText.trim()) {
			ul.innerHTML = ``
			return
		}

		const url = `https://news.naver.com/`

		loadCors(url, _html => {
			const parser = new DOMParser()
			const doc = parser.parseFromString(_html, `text/html`)
			ul.innerHTML = ``
			
			doc.querySelectorAll(`a[href*="/main/read.nhn?mode=LSD"]`).forEach((a, index) => {
				if (index >= 5) {
					return
				}
				if (a.textContent.includes(searchText)) {
					ul.insertAdjacentHTML(`beforeend`, `<li class="search-link" data-url="${a.href}" data-oid="${a.href.match(/oid=(.*?)&/)[1]}" data-aid="${a.href.split(`aid=`)[1]}">${a.textContent}</li>`)
				}
			})
		})
	}

	switchURL(modal, url, _html, doc) {
		if (url.includes(`daum`)){
			return modal.addContent(this.searchNewsContentDaum(_html, doc))
		} else if (url.includes(`naver`)){
			this.createNewsContent(_html, doc)
		}
		return null
	}

	createNewsContent(_html, doc) {
		const modal = this.shadowRoot.querySelector(`modal-news`)		
		const div = doc.querySelector(`.content`)

		// console.info(`HTML: `, div)
		modal.countImg(doc)
		modal.addContent(`.news-header`, this.getPressLogo(div))
		modal.addContent(`.news-header`, this.getTitle(div))
		modal.addContent(`.news-header`, this.getInputTime(div))
		modal.addContent(`.news-body`, this.getNewsContent(div))
		modal.clearBlankText()
	}

	searchNewsContentDaum(_html, doc) {
		let div = document.createElement(`div`)

		div = doc.querySelector(`.popup_print`)

		this.getTitleDaum(div)
		this.getPressLogoDaum(div)
		this.getInputTimeDaum(div)
		this.getNewsContentDaum(div)
		this.getImageDaum(div)

		return div
	}

	/* Naver Start */

	getTitle(div) {
		// console.info(`TITLE: `, div.querySelector(`h3`))
		return div.querySelector(`h3`)
	}

	getPressLogo(a) {
		// console.info(`Press Logo: `, a.querySelector(`.press_logo`))
		return a.querySelector(`.press_logo`)
	}

	getInputTime(span) {
		// console.info(`Input Time: `,span.querySelector(`.t11`))
		return span.querySelector(`.t11`)
	}

	getNewsContent(div){		
		const result = document.createElement(`div`)
		let _div = div
		result.classList.add(`news-inner`)
		// console.groupCollapsed(`BODY`)
		_div = this.deleteAdAnchor(_div)
		Array.from(_div.querySelector(`.article_body`).childNodes).forEach(element => {
			let _element = element
			if (_element.localName === `br`) {
				return
			}
			_element = this.textToParagraph(_element)

			// console.info(_element)
			result.appendChild(_element.cloneNode(true))
		})
		// console.groupEnd()
		// console.info(`BODY-RESULT: `, result)
		return result
	}

	deleteAdAnchor(div) {
		[...div.querySelectorAll(`a`)].forEach(a => {
			const isNextA = () => a.nextSibling && a.nextSibling.nodeName === `#text`
			const isPreviousA = () => a.previousSibling && a.previousSibling.nodeName === `#text`
			if (isNextA()) {
				a.nextSibling.remove()
			}

			if (isPreviousA()) {
				a.previousSibling.remove()
			}
			a.remove()
		})

		return div
	}

	textToParagraph(node) {
		const p = document.createElement(`p`)
		if (node.nodeName === `#text` && node.textContent.trim() === ``) {
			return document.createDocumentFragment()
		}

		if (node.nodeName === `#text`) {
			p.appendChild(node)
			return p
		}
		return node
	}

	getImage(img) {
		// console.info(`Image File: `,img.querySelectorAll(`img:not([src*="logo"])`))
		return img.querySelectorAll(`img:not([src*="logo"])`)
	}

	/* Naver End */

	/* Daum Start */

	getTitleDaum(div) {
		// console.info(`TITLE: `, div.querySelector(`h3`))
		return div.querySelector(`h3`)
	}

	getPressLogoDaum(img) {
		// console.info(`Press Logo: `, img.querySelector(`.thumb_g`))
		return img.querySelector(`.thumb_g`)
	}

	getInputTimeDaum(span) {
		const spans = [...span.querySelectorAll(`.txt_info`)]
		let resultSpan
		for (let i = 0; i < spans.length; i++) {
			let spanText = spans[i].textContent

			if (spanText.includes(`입력`)) {
				spanText = spanText.split(`입력`)[1]
				spans[i].textContent = spanText.trim()
				resultSpan = spans[i]
				break
			}
		}
		// console.info(`Input Time: `, resultSpan)
		return resultSpan		
	}

	getNewsContentDaum(dom) {			
		const article = dom.querySelector(`#harmonyContainer > section`)
		article.classList.add(`article-body`)
		
		// console.info(`BODY-RESULT: `, article)
		return article		
	}

	getImageDaum(dom) {
		const imgs = dom.querySelectorAll(`#harmonyContainer > section img`)
		// console.info(`Image File: `, imgs)
		return imgs
	}

	/* Daum End */

	async resizePage(scale = 1) {
		const div = await document.querySelector(`page-main`)

		let _scale = scale
	
		if (document.body.clientWidth >= div.clientWidth * _scale && document.body.clientHeight >= div.clientHeight * _scale) {
			return
		}

		_scale -= 0.01
		div.style.transform = `scale(${_scale})`
		
		this.resizePage(_scale)
	}

	resizeThrottler() {
		clearTimeout(window.resizeTimeoutPage)
	
		window.resizeTimeoutPage = setTimeout(() => {
			window.resizeTimeoutPage = null
			this.resizePage()
		}, 200)
	}

	render() {
		return html` 
		<link rel="stylesheet" type="text/css" href="./src/css/foundation-icons.css">
		${style}
		<div id="pageMain">
			<div class="logo-wrap">
				<img class="logo" src="/src/img/logo.png" width="270"/>
				<h1 class="site-description">네이버 뉴스를 한 눈에!</h1>
			</div>					
			<div class="search-wrap">
				<input type="search" name="search" placeholder="네이버 실시간 뉴스를 검색 해보세요.(news.naver.com/ 메인화면만 검색)" class="animated-search-form type-url">
				<ul class="search-text"></ul>
			</div>
			<div class="dropdown">
				<button class="dropbtn">카테고리</button>
				<div class="dropdown-content">
					<a class="category-list active" href="#">정치 <i class="fi-check size-72"></i></a>
					<a class="category-list active" href="#">경제 <i class="fi-check size-72"></i></a>
					<a class="category-list active" href="#">사회 <i class="fi-check size-72"></i></a>
					<a class="category-list active" href="#">생활·문화 <i class="fi-check size-72"></i></a>
					<a class="category-list active" href="#">세계 <i class="fi-check size-72"></i></a>
					<a class="category-list active" href="#">IT·과학 <i class="fi-check size-72"></i></a>
					<a class="category-submit" href="#">뉴스 보기 시작</a>
				</div>
			</div>
        </div>
		<modal-news />
        `
	}
}

const style = html`
<style>	
#pageMain {
	display: -ms-grid;
	display: grid;
	width: -webkit-fit-content;
	width: -moz-fit-content;
	width: fit-content;
	margin: auto;
	margin-bottom: 10vh;
	    grid-template-areas: 
		"logo category"
		"search search";
}

#pageMain > .logo, #pageMain > .site-description {
	display: block;
	margin-left: auto;
	margin-right: auto;
}

#pageMain * {
	font-family: 'Noto Sans KR', sans-serif;
}

.logo-wrap {
	-ms-grid-row: 1;
	-ms-grid-column: 1;
	grid-area: logo;
	text-align: center;
	-ms-grid-row-align: center;
	    align-self: center;
}

.logo {
	-webkit-user-select: none;
	   -moz-user-select: none;
	    -ms-user-select: none;
	        user-select: none;
	-webkit-box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
	        box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
	min-width: 15vw;
	width: 250px;
	max-width: 90vw;
}

.site-description {
	-webkit-user-select: none;
	   -moz-user-select: none;
	    -ms-user-select: none;
	        user-select: none;
	color: #4CAF50;
    text-align: center;
    margin: 1vh 0;
	font-size: 25px;
	font-weight: bold;
}

/* 실시간 검색 CSS */
.search-wrap {
	grid-area: search;
}

.animated-search-form[type=search] {
	margin-top: 10px;
	min-width: 50vw;
	width: 400px;
	max-width: 95vw;
	border: 0.125rem solid #e6e6e6;
	box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
	border-radius: 0;
	padding: 5px 10px;
	transition: width 0.4s ease-in-out;
	line-height: 0;
	font-size: 0.7vmax;	
	text-align: left;
    padding-left: calc(2vw + 5px);
}

.search-text {
	list-style: none;
	text-overflow: ellipsis;
	background-color: white;
    overflow: hidden;
	box-shadow: 0 5px 10px rgba(0,0,0,.2);
	padding: 0;
}

.search-text li {
	padding-left: 1vw;	
	padding-top: 1vh;
	transition: all 0.2s ease-in-out;
	color: black;
	cursor: pointer;
}

.search-text li:hover {
	background-color: #55ACEE;
	color: white;
}

.search-text li:last-of-type {
	padding-bottom: 1vh;
}

/* 카테고리 박스 */

.dropdown {
	-ms-grid-row: 1;
	-ms-grid-column: 2;
	-webkit-user-select: none;
	   -moz-user-select: none;
	    -ms-user-select: none;
	        user-select: none;
	grid-area: category;
	margin-left: 20px;
	position: relative;
	display: inline-block;
	height: -webkit-fit-content;
	height: -moz-fit-content;
	height: fit-content;
    -ms-grid-row-align: center;
        align-self: center;
    margin: 0 20px;
}

.dropbtn {		
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	font-size: 16px;
	border: none;
	cursor: pointer;
	-webkit-transition: all 0.2s ease-in;
	transition: all 0.2s ease-in;
}

.dropdown-content {
	display: block;
	position: relative;
	background-color: #f9f9f9;
	min-width: 160px;
	-webkit-box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	-webkit-transition: max-height 0.2s ease-in-out;
	transition: max-height 0.2s ease-in-out;
	max-height: 336px;
	overflow: hidden;
}

.dropdown-content.close {
	max-height: 0;
	-webkit-transition: max-height 0.2s ease-in-out;
	transition: max-height 0.2s ease-in-out;
	overflow: hidden;
}

.dropdown-content a {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	-webkit-transition: all 0.2s ease-in;
	transition: all 0.2s ease-in;
}

.dropdown-content a:last-of-type {
	background-color: #AF4034;
    color: white;
}

.dropdown-content a:last-child:hover {
	background-color: hsl(6, 54%, 35%);
}

.dropdown-content a:not(:last-of-type):hover {
	background-color: #f1f1f1;
}

.category-list i {
	display: none;
	float: right;
}

.category-list.active i {
	display: block;
}

.dropbtn:hover {
	background-color: #3e8e41;
}


</style>
`

customElements.define(`page-main`, PageMain)
