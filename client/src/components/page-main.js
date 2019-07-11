import { html } from 'lit-html'

import LitRender from '../libs/litRender'

export class PageMain extends LitRender(HTMLElement) {
	constructor() {
		super()

		this.attachShadow({ mode: `open` })

		this.invalidate()
	}

	render() {
		return html` 
		${style}
		<div id="PageMain">
			INIT
        </div>
        `
	}
}

const style = html`
<style>
#pageMain {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	width: 95vw;
	height: 98vh;
	margin: auto;
}
</style>
`

customElements.define(`page-main`, PageMain)
