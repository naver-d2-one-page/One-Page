import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class ModalNews extends LitRender(HTMLElement) {
	constructor() {
		super()

		this._newsList = []
		this._handlers = {}
		this._numColumn = 2
		this.style.display = `none`
		this._currentNews = 1
		this._categoryIndex = 0

		this.attachShadow({ mode: `open` })

		this.invalidate()
	}
    
	connectedCallback() {
		const root = this.shadowRoot
		const handlers = this._handlers

		handlers.onClick = this._onClick.bind(this)				
        
		root.addEventListener(`click`, handlers.onClick)
		window.addEventListener(`resize`, () => {
			this.resizeThrottler()
		})
	}

	disconnectedCallback() {
		const root = this.shadowRoot

		root.removeEventListener(`click`, this._handlers.onClick)
	}
    
	_onClick(event) {	
		this.clickClose(event)
		this.clickMoveNews(event)
		this.clickLeftCategory(event)
		this.clickRightCategory(event)
		this.clickPause(event)
	}

	clickClose(event) {
		if (event.target.classList.contains(`close-modal`)) {
			this.hide()
		}
	}

	clickMoveNews(event) {
		if (event.target.classList.contains(`move-news`)) {			
			this._currentNews = event.target.dataset.step
			document.querySelector(`page-main`).loadDom(event.target.dataset.url)
		}
	}

	clickLeftCategory(event) {
		if (event.target.classList.contains(`category-move-left`)) {
			this._categoryIndex--
			this.makeProgressBar(this._categoryIndex)
			this.removeActiveProgress()
			this.shadowRoot.querySelector(`.is-current`).click()
		}
	}

	clickRightCategory(event) {
		if (event.target.classList.contains(`category-move-right`)) {
			this._categoryIndex++
			this.makeProgressBar(this._categoryIndex)
			this.removeActiveProgress()
			this.shadowRoot.querySelector(`.is-current`).click()
		}
	}

	clickPause(event) {
		if (event.target.classList.contains(`pause`)) {			
			if (!event.target.classList.contains(`play`)) {
				event.target.classList.add(`play`)
				this.clearInrevalPage()
				return
			}
			event.target.classList.remove(`play`)
			this.setIntervalPage()
		}
	}

	removeActiveProgress() {
		this.shadowRoot.querySelector(`.is-current`).classList.remove(`is-current`)
		this.shadowRoot.querySelector(`.move-news`).classList.add(`is-current`)
	}

	setIntervalPage() {
		this.clearInrevalPage()
		this.intervalPage = window.setInterval(() => {
			if (this.shadowRoot.querySelector(`.is-current + *`)) {
				this.shadowRoot.querySelector(`.is-current + *`).click()
				return
			}
			this.shadowRoot.querySelector(`.category-move-right`).click()
		}, 5000)
	}

	clearInrevalPage() {
		window.clearInterval(this.intervalPage)
	}

	makeProgressBar(activeCategory = 0) {
		const bar = this.shadowRoot.querySelector(`.news-footer ol`)
		let _activeCategory = activeCategory
		if (_activeCategory < 0) {
			_activeCategory = this._newsList.length - 1
		}
		if (_activeCategory >= this._newsList.length) {
			_activeCategory = 0
		}

		this._categoryIndex = _activeCategory
		this._activeCategory = this._newsList[_activeCategory][0]
		this.shadowRoot.querySelector(`.show-category strong`).textContent = this._activeCategory

		bar.innerHTML = ``
		this._newsList.find(each => each[0] === this._activeCategory)[1][`result`].forEach((news, index) => {
			bar.insertAdjacentHTML(`beforeend`, `<li data-url="${news.link}" class="${index === this._currentNews - 1 ? `is-current` : ``} move-news" data-step="${index + 1}"></li>`)
		})	
	}
    
	empty() {
		this.shadowRoot.querySelector(`.news-content`).innerHTML = `
			<div class="news-header"></div>
			<div class="news-body"></div>
			<div class="news-footer">
				<ol class="progress-indicator"></ol>
				<span class="show-category">
					<i class="fi-arrow-left size-72 category-move-left"></i>
					<strong>Category</strong>
					<i class="fi-arrow-right size-72 category-move-right"></i>
					<i class="fi-pause size-72 pause"></i>
				</span>				
			</div>
		`
	}
    
	addContent(parent = `.news-content`, element) {	
		this.shadowRoot.querySelector(parent).appendChild(element)		
	}
    
	show() {
		this.style.display = `block`
		document.querySelector(`page-main`).style.transform = `none`
	}
    
	hide() {
		this.style.display = `none`
		this.clearInrevalPage()
	}

	countImg(dom) {
		const length = dom.querySelectorAll(`.article_body img`).length
		let complete = 0
		this._numColumn = 2		

		dom.querySelectorAll(`.article_body img`).forEach(img => {
			const getSize = new Image()
			getSize.src = img.src
			getSize.onload = () => {
				const textLength = Math.floor(this.shadowRoot.querySelector(`.news-inner`).textContent.length / 3000)
				this._numColumn++
				complete++
				if (length === complete) {
					for (let i = 0; i < textLength; i++) {						
						this._numColumn++
					}
					this.autoSetScale()
					this.invalidate()
				}				
			}
		})
		if(!length) {
			this.autoSetScale()
		}
		this.invalidate()
	}

	async autoSetScale(scale = 1) {
		const div = await this.shadowRoot.querySelector(`.news-body`)
		const innerDiv = div.querySelector(`.news-inner`)
		let _scale = scale
		if (!innerDiv) {
			return
		}

		if (div.clientHeight >= innerDiv.clientHeight * _scale) {
			this.increaseHeight(_scale)
			return
		}

		if (_scale <= 0.65) {
			innerDiv.classList.add(`show`)
			return
		}
		_scale -= 0.01
		this.setNoScroll(div, innerDiv, _scale, 1)
		
		this.autoSetScale(_scale)
	}

	resizeThrottler() {
		clearTimeout(window.resizeTimeout)
	
		window.resizeTimeout = setTimeout(() => {
			window.resizeTimeout = null
			if (this.style.display === `none`) {
				return
			}
			this.activeFunc()
		}, 200)
	}

	activeFunc() {
		this.shadowRoot.querySelector(`.news-body`).style.overflow = `scroll`
		this.autoSetScale()
	}

	async increaseHeight(_scale = 1) {
		const div = await this.shadowRoot.querySelector(`.news-body`)
		const innerDiv = div.querySelector(`.news-inner`)
		let __scale = _scale

		// if (__scale < 2) {
		// 	return
		// }

		__scale += 0.01
		this.setNoScroll(div, innerDiv, __scale)

		if (div.clientHeight < innerDiv.clientHeight * __scale) {
			__scale -= 0.01
			this.setNoScroll(div, innerDiv, __scale)
			innerDiv.style.top = `50%`
			div.style.overflow = `hidden`
			innerDiv.classList.add(`show`)
			return
		}
		this.increaseHeight(__scale)
	}

	setNoScroll(div, innerDiv, scale, sharp = 0) {
		innerDiv.style.transform = `translate(-50%, -50%) scale(${scale}) perspective(${sharp}px) translate3d(0,0,0)`
		innerDiv.style.width = `calc(1 / ${scale} * 100%)`
		innerDiv.style.top = `calc(50% + ${(scale * innerDiv.clientHeight - div.clientHeight) / 2}px)`
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(() => resolve(), ms))
	}

	clearBlankText() {
		[...this.shadowRoot.querySelectorAll(`.news-inner *`)].forEach(el => {
			const isImg = () => el.tagName === `IMG` || el.querySelector(`img`)
			const isBr = el.tagName === `BR`
			if (el.textContent.length || isImg() || isBr) {
				return
			}
			el.remove()
		})
	}

	render() {		
		return html`
        <link rel="stylesheet" type="text/css" href="./src/css/foundation-icons.css">
		${style}
		${setStyle(this._numColumn)}
        <span class="close-modal"><i class="fi-x-circle size-72 close-modal"></i></span>
		<div class="news-content news-wrap">
			<div class="news-header"></div>
			<div class="news-body"></div>
			<div class="news-footer">
				<ol class="progress-indicator">
					<li class="is-complete" data-step="1"></li>
					<li class="is-current" data-step="2"></li>
					<li class="" data-step="3"></li>
				</ol>
				<span class="show-category">Category</span>
			</div>
		</div>
        `
	}
}

function setStyle(count = ``) {
	return html`
	<style>
	.news-body .news-inner {
		columns: 300px ${count};
	}
	</style>
	`
}

const style = html`
<style>	
*::-webkit-scrollbar {
	width: 0;
}

.news-content {    
    position: fixed;
    top: 2.5vh;
    left: 2.5vw;
	width: 95vw;
	height: 95vh;
	padding: 1vh 1vw;
	-webkit-box-sizing: border-box;
	        box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
    overflow: scroll;
    -webkit-animation: 0.2s show ease-in-out;
			animation: 0.2s show ease-in-out;
	-webkit-box-shadow: 0 17px 50px rgba(0, 0, 0, 0.19), 0 12px 15px rgba(0, 0, 0, 0.24);
	        box-shadow: 0 17px 50px rgba(0, 0, 0, 0.19), 0 12px 15px rgba(0, 0, 0, 0.24);
}

.close-modal {    
    position: fixed;
    top: 3vh;
    right: 3vw; 
    cursor: pointer;
    z-index: 200;
}

.close-modal i::before {
    font-size: 30px;
    cursor: pointer;
	color: lightgray;
	-webkit-transition: all 0.2s ease-in-out;
	transition: all 0.2s ease-in-out;
}

.close-modal i:hover::before {
	cursor: pointer;
    color: #4CAF50;
}

@-webkit-keyframes show {
  from {
    -webkit-transform: scale(0);
            transform: scale(0);
  }

  to {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}

@keyframes show {
  from {
    -webkit-transform: scale(0);
            transform: scale(0);
  }

  to {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}

.hide-content {
    display: none;
}

.news-wrap {
	display: -ms-grid;
	display: grid;
	    grid-template-areas:
		"news-header"
		"news-body"
		"news-footer";
    -ms-grid-rows: 10vh auto 20px;
    grid-template-rows: 10vh auto 20px;
	overflow: hidden;
}

.news-header {
	-ms-grid-row: 1;
	-ms-grid-column: 1;
	grid-area: news-header;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
    -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
	-webkit-box-align: center;
	    -ms-flex-align: center;
	        align-items: center;
	border-bottom: 1px solid #DDDDDD;
	-webkit-box-sizing: border-box;
	        box-sizing: border-box;
    height: 10vh;
}

.news-header > * {
	margin: 0 5px;
}

.news-header > h3 {
	word-break: keep-all;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    font-size: 2.5vmin;
    text-align: center;
}

.news-header > .t11 {
	font-size: 1vmin;
    color: #666;
    padding-top: 1.25vmin;
}

.news-body {
  	-ms-grid-row: 2;
  	-ms-grid-column: 1;
  	grid-area: news-body;
  	/* margin: auto; */
  	overflow: scroll;
	height: calc(83vh - 20px);
	position: relative;
	-ms-overflow-style: none;

	/* overflow: hidden; */
}

.news-body .news-inner {
	-webkit-columns: 300px;
	   -moz-columns: 300px;
	        columns: 300px;
    -webkit-column-fill: balance;
       -moz-column-fill: balance;
            column-fill: balance;
    overflow: hidden;
	margin: auto 0;
	/* min-height: 100%; */

	/* font-size: calc(12px + (26 - 12) * ((100vw - 300px) / (3000 - 300)));
    line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(3000 - 300))); */

	/* no flex use */
	/* display: flex;
	flex-direction: column;
    flex-flow: column wrap;
	height: 100%; */

	-webkit-transform: translate(-50%, -50%) scale(1) perspective(0px) translate3d(0,0,0);

	        transform: translate(-50%, -50%) scale(1) perspective(0px) translate3d(0,0,0);
	width: 100%;
    top: 50%;
    left: 50%;
    position: absolute;	
	font-size: 16px;

	opacity: 0;
    -webkit-transition: opacity 0.2s ease-in;
    transition: opacity 0.2s ease-in;
}

.news-body .news-inner.show {
	opacity: 1;
}

.news-body .news-inner > * {
	/* no flex use */
	/* flex: 0 0 auto;
	width: 300px;
	height: min-content; */
}

/* 이미지마다 컬럼 엔터 */
/* .end_photo_org, .end_photo_org * {
	break-before: column;
} */

.end_photo_org {
	display: inline-block;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    justify-items: center;
    width: 100%;
}

.news-inner em {
	font-size: small;
	text-align: center;
}

.news-inner strong {
	display: block;
    padding-left: 5px;
    margin: 5px 0;
	border-left: 2px solid #141414;
	margin-top: 1em;
    margin-bottom: 1em;
}

.news-footer {
  -ms-grid-row: 3;
  -ms-grid-column: 1;
  grid-area: news-footer;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr;
  grid-template-columns: auto auto;
  -ms-grid-rows: 1fr;
  grid-template-rows: 1fr;
  height: 20px;
}

.news-footer > *:nth-child(1) {
	-ms-grid-row: 1;
	-ms-grid-column: 1;
}

.news-footer > *:nth-child(2) {
	-ms-grid-row: 1;
	-ms-grid-column: 2;
}

.news-inner img {
	max-width: 100%;
    max-height: 70vh;
    display: block;
    margin: 0 auto !important;
}

.news-inner table {
	display: inline-block;
	width: 100%;
	max-width: 100%;
	max-height: 70vh;
    margin: 0 auto !important;
}

.news-inner table * {
	display: block;
	width: 100% !important;
}

/* tbody {
	display: inline-block;
} */

@media all and (max-width: 450px) {
	.news-inner img {
		max-height: none;
		width: 100%;
	}
}

/* progress-bar */

.progress-indicator {
  list-style: none;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: table;
  table-layout: fixed;
}

.progress-indicator > li {
  position: relative;
  display: table-cell;
  text-align: center;
  font-size: 1.5em;
}

.progress-indicator > li span {
  position: absolute;
  color: #e6e6e6;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05px;
  text-transform: uppercase;
}

.progress-indicator > li::before {
  content: '';
  display: block;
  margin: 0 auto;
  background: #DDDDDD;
  width: 20px;
  height: 20px;
  text-align: center;
  margin-bottom: 0;
  line-height: 20px;
  border-radius: 100%;
  position: relative;
  z-index: 1000;
}

.progress-indicator > li::after {
  content: '';
  position: absolute;
  display: block;
  background: #e6e6e6;
  width: 100%;
  height: 0.15em;
  top: 50%;
  -webkit-transform: translateY(-100%);
          transform: translateY(-100%);
  left: 50%;
  margin-left: 1.5em\9;
  z-index: 0;
}

.progress-indicator > li:last-child:after {
  display: none;
}

.progress-indicator > li.is-complete {
  color: #1779ba;
}

.progress-indicator > li.is-complete::before, .progress-indicator > li.is-complete::after {
  color: #fefefe;
  background: #1779ba;
}

.progress-indicator > li.is-complete span {
  color: #1779ba;
}

.progress-indicator > li.is-current {
  color: #4eabe9;
}

.progress-indicator > li.is-current::before {
  color: #fefefe;
  background: #4CAF50;
}

.progress-indicator > li.is-current span {
  color: #4eabe9;
}

.move-news::before {
	cursor: pointer;
	-webkit-transition: all 0.2s ease-in-out;
	transition: all 0.2s ease-in-out;	
}

.move-news:hover::before {
	background-color: #4CAF50;
}

.show-category {
	display: -ms-grid;
	display: grid;
    -ms-grid-columns: 1fr 1fr 1fr 1fr;
    grid-template-columns: auto auto auto auto;
    -ms-grid-rows: 1fr;
    grid-template-rows: 1fr;
	font-size: 13px;
    font-weight: bold;
    min-width: 110px;
    text-align: center;
}

.show-category > *:nth-child(1) {
	-ms-grid-row: 1;
	-ms-grid-column: 1;
}

.show-category > *:nth-child(2) {
	-ms-grid-row: 1;
	-ms-grid-column: 2;
}

.show-category > *:nth-child(3) {
	-ms-grid-row: 1;
	-ms-grid-column: 3;
}

.show-category > *:nth-child(4) {
	-ms-grid-row: 1;
	-ms-grid-column: 4;
}

.show-category strong {
	margin: 0 5px;
}

.fi-arrow-right::before, .fi-arrow-left::before, .pause::before {
	font-size: 18px;
    border-radius: 100%;
    width: 20px;
    height: 20px;
    background-color: #DDDDDD;
    color: white;
	line-height: 20px;
	text-align: center;
	-webkit-transition: all 0.2s ease-in-out;
	transition: all 0.2s ease-in-out;
}

.fi-arrow-right:hover::before, .fi-arrow-left:hover::before, .pause:hover::before {
	cursor: pointer;
	background-color: #4CAF50;
}

.pause {
	margin-left: 5px;
}

.pause::before {
	content: "";
}

.pause.play::before {
	content: "\\f198" !important;
}

</style>
`

customElements.define(`modal-news`, ModalNews)
