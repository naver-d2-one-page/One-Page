import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class ModalNews extends LitRender(HTMLElement) {
	constructor() {
		super()

		this._handlers = {}
		this._numColumn = 2
		this.style.display = `none`

		this.attachShadow({ mode: `open` })

		this.invalidate()
	}
    
	connectedCallback() {
		const root = this.shadowRoot
		const handlers = this._handlers

		handlers.onClick = this._onClick.bind(this)				
        
		root.addEventListener(`click`, handlers.onClick)
		window.onresize = () => this.resizeThrottler()
	}

	disconnectedCallback() {
		const root = this.shadowRoot

		root.removeEventListener(`click`, this._handlers.onClick)
	}
    
	_onClick(event) {	
		if (event.target.classList.contains(`close-modal`)) {
			this.hide()
		}
	}
    
	empty() {
		this.shadowRoot.querySelector(`.news-content`).innerHTML = `
			<div class="news-header"></div>
			<div class="news-body"></div>
			<div class="news-footer"></div>
		`
	}
    
	addContent(parent = `.news-content`, element) {
		this.shadowRoot.querySelector(parent).appendChild(element)
	}
    
	show() {
		this.style.display = `block`
	}
    
	hide() {
		this.style.display = `none`
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
	}

	async autoSetScale(scale = 1) {
		const div = await this.shadowRoot.querySelector(`.news-body`)
		const innerDiv = div.querySelector(`.news-inner`)
		let _scale = scale
		// console.info(`${div.clientHeight} >= ${innerDiv.clientHeight * _scale}`, innerDiv.scrollHeight)
		
		if (div.clientHeight >= innerDiv.clientHeight * _scale) {
			innerDiv.style.top = `50%`
			div.style.overflow = `hidden`
			return
		}

		if (_scale <= 0.7) {			
			return
		}
		_scale -= 0.01
		_scale = _scale.toFixed(2)
		innerDiv.style.transform = `translate(-50%, -50%) scale(${_scale}) perspective(1px)`
		innerDiv.style.width = `calc(1 / ${_scale} * 100%)`
		innerDiv.style.top = `calc(50% + ${(_scale * innerDiv.clientHeight - div.clientHeight) / 2}px)`
		// console.info(_scale, innerDiv.clientHeight)
		
		this.autoSetScale(_scale)
	}

	resizeThrottler() {
		clearTimeout(window.resizeTimeout)
	
		window.resizeTimeout = setTimeout(() => {
			window.resizeTimeout = null
			this.activeFunc()
		}, 200)
	}

	activeFunc() {
		this.shadowRoot.querySelector(`.news-body`).style.overflow = `scroll`
		this.autoSetScale()
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
			<div class="news-footer"></div>
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
    font-size: 3vmax;
    cursor: pointer;
    color: lightgray;
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
	display: grid;
	grid-template-areas:
		"news-header"
		"news-body"
		"news-footer";
    grid-template-rows: 10vh auto 20px;
	overflow: hidden;
}

.news-header {
	grid-area: news-header;
	display: flex;
    flex-wrap: nowrap;
    justify-content: center;
	align-items: center;
	border-bottom: 1px solid #DDDDDD;
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
  	grid-area: news-body;
  	/* margin: auto; */
  	overflow: scroll;
	height: calc(83vh - 20px);
	position: relative;
	-ms-overflow-style: none;

	/* overflow: hidden; */
}

.news-body .news-inner {
	columns: 300px;
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

	transform: translate(-50%, -50%) scale(1) perspective(1px);
	width: 100%;
    top: 50%;
    left: 50%;
    position: absolute;	
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
  grid-area: news-footer;
  height: 20px;
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

</style>
`

customElements.define(`modal-news`, ModalNews)
