import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class ModalNews extends LitRender(HTMLElement) {
	constructor() {
		super()

		this._handlers = {}
		this._imgLength = ``
		this.style.display = `none`

		this.attachShadow({ mode: `open` })

		this.invalidate()
	}
    
	connectedCallback() {
		const root = this.shadowRoot
		const handlers = this._handlers

		handlers.onClick = this._onClick.bind(this)				
        
		root.addEventListener(`click`, handlers.onClick)		
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
		this._imgLength = length
		this.invalidate()
		return length
	}

	render() {
		return html`
        <link rel="stylesheet" type="text/css" href="./src/css/foundation-icons.css">
		${style}
		${setStyle(this._imgLength)}
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
	padding: 20px;
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
    top: 30px;
    right: 70px; 
    cursor: pointer;
    z-index: 200;
}

.close-modal i::before {
    font-size: 40px;
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
  	margin: auto;
  	overflow: scroll;
	height: calc(85vh - 60px);
}

.news-body .news-inner {
	columns: 300px;
    column-fill: balance;
    overflow: hidden;
    margin: auto 0;

	font-size: calc(12px + (26 - 12) * ((100vw - 300px) / (3000 - 300)));
    line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(3000 - 300)));

	/* display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, auto));
  	grid-auto-flow: row;
	height: 100%; */
}

/* 이미지마다 컬럼 엔터 */
/* .end_photo_org, .end_photo_org * {
	break-before: column;
} */

.news-footer {
  grid-area: news-footer;
  height: 20px;
}

img {
	max-width: 100%;
    max-height: 70vh;
    display: block;
    margin: 0 auto;
}

</style>
`

customElements.define(`modal-news`, ModalNews)
