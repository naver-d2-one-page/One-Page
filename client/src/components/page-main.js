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
		<div id="pageMain">
			<img class="logo" src="/src/img/logo.png" width="270"/>
			<h1 class="site-description">사이트 설명</h1>
			<input type="search" name="search" placeholder="보고싶은 기사의 URL을 입력해주세요." class="animated-search-form">
        </div>
        `
	}
}

const style = html`
<style>
#pageMain {
	display: grid;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	width: 95vw;
	margin: auto;
	justify-items: center;
	margin-bottom: 100px;
}

.site-description {
	color: #3498DB;
    text-align: center;
    margin: 1vh 0;
    font-size: 2em;
}

.animated-search-form[type=search] {
  margin-top: 40px;
  width: 500px;
  max-width: 95vw;
  border: 0.125rem solid #e6e6e6;
  box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
  border-radius: 0;
  background-image: url("//image.ibb.co/i7NbrQ/search_icon_15.png");
  background-position: 0.625rem 0.625rem;
  background-repeat: no-repeat;
  padding: 0.75rem 1.25rem 0.75rem 2rem;
  transition: width 0.4s ease-in-out;
}

.animated-search-form[type=search]:focus {
  width: 100%;
}

</style>
`

customElements.define(`page-main`, PageMain)
