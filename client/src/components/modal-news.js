import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class ModalNews extends LitRender(HTMLElement) {
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
        
		root.addEventListener(`click`, handlers.onClick)		
	}

	disconnectedCallback() {
		const root = this.shadowRoot

		root.removeEventListener(`click`, this._handlers.onClick)
	}
    
	_onClick(event) {		
		if (event.target.closest(`.close-modal`)) {
			this.hide()
		}
	}
    
	empty() {
		this.shadowRoot.querySelector(`.modal-news`).innerHTML = ``
	}
    
	addContent(element) {
		this.shadowRoot.querySelector(`.modal-news`).appendChild(element)
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
        <span class="close-modal"><i class="fi-x-circle size-72"></i></span>
		<div class="modal-news"></div>
        `
	}
}

const style = html`
<style>	
:host {
    display: none;
}

.modal-news {    
    position: fixed;
    top: 2.5vh;
    left: 2.5vw;
	width: 95vw;
    height: 95vh;
    background-color: white;
    border-radius: 5px;
    overflow: scroll;
    animation: 0.2s show ease-in-out;
}

.close-modal {    
    position: fixed;
    top: 20px;
    right: 50px; 
    cursor: pointer;
    z-index: 200;
}

.close-modal i::before {
    font-size: 40px;
    cursor: pointer;
    color: lightgray;
}

@keyframes show {
  from {
    transform: scale(0)
  }

  to {
    transform: scale(1)
  }
}

.hide-content {
    display: none;
}

</style>
`

customElements.define(`modal-news`, ModalNews)
