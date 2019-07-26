import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class ModalNews extends LitRender(HTMLElement) {
	constructor() {
		super()

		this._handlers = {}
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

	render() {
		return html`
        <link rel="stylesheet" type="text/css" href="./src/css/foundation-icons.css">
        ${style}
        <span class="close-modal"><i class="fi-x-circle size-72 close-modal"></i></span>
		<div class="news-content news-wrap">
			<div class="news-header"></div>
			<div class="news-body"></div>
			<div class="news-footer"></div>
		</div>
        `
	}
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
            transform: scale(0)
  }

  to {
    -webkit-transform: scale(1);
            transform: scale(1)
  }
}

@keyframes show {
  from {
    -webkit-transform: scale(0);
            transform: scale(0)
  }

  to {
    -webkit-transform: scale(1);
            transform: scale(1)
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
}

.news-header {
	grid-area: news-header;
}

.news-body {
  display: grid;
  grid-area: news-body;
  grid-template-rows: repeat(auto-fit, minmax(250px, auto));
  grid-auto-flow: row;
  margin: 0 auto;
  overflow: scroll;
}

.news-footer {
  grid-area: news-footer;
}

</style>
`

customElements.define(`modal-news`, ModalNews)
