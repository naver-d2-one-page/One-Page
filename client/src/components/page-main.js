import { html } from 'lit-html'

import LitRender from '../libs/litRender'

import axios from 'axios'
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

		handlers.onEnter = this._onEnter.bind(this)				
		
		root.addEventListener(`keydown`, handlers.onEnter)		
	}

	disconnectedCallback() {
		const root = this.shadowRoot

		root.removeEventListener(`keydown`, this._handlers.onEnter)
	}

	_onEnter(event) {
		if (event.target.classList.contains(`type-url`) && event.key === `Enter`) {
			const url = event.target.value
			this.loadAxios(url)
		}
	}

	loadFetch(url) {
		const _url = new URL(url)
		const host = _url.host
		const path = _url.pathname
		const search = _url.search

		fetch(`https://cors.kro.kr/${host}${path}${search}`, {
			"method": `GET`,
			headers: {
				"User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Whale/1.5.73.16 Safari/537.36`,
			},
		}).then(res => res.text())
			.then(text => {
				console.info(text)
			})
	}

	async loadAxios(url) {
		const _url = new URL(url)
		const host = _url.host
		const path = _url.pathname
		const search = _url.search
		const config = {
			method: `get`,
			url: `https://cors.kro.kr/${host}${path}${search}`,
		}
		
		try {
			const _html = await axios(config)
			const parser = new DOMParser()
			const doc = parser.parseFromString(_html.data, `text/html`)
			const modal = this.shadowRoot.querySelector(`modal-news`)

			modal.empty()
			this.searchNewsContent(_html.data, doc)
			modal.show()
		} catch(err) {
			console.error(err)
		}
	}

	loadXhr(url) {
		const xhr = new XMLHttpRequest()
		const _url = new URL(url)
		const host = _url.host
		const path = _url.pathname
		const search = _url.search
		if(!xhr) {
			throw new Error(`XHR 호출 불가`)
		}

		xhr.open(`GET`, `https://cors.kro.kr/${host}${path}${search}`)
		xhr.setRequestHeader(`x-requested-with`, `XMLHttpRequest`)
		xhr.addEventListener(`readystatechange`, () => {			
			if (xhr.readyState === xhr.DONE) {				
				if (xhr.status === 200 || xhr.status === 201) {					
					const _html = xhr.responseText
					const parser = new DOMParser()
					const doc = parser.parseFromString(_html, `text/html`)
					const modal = this.shadowRoot.querySelector(`modal-news`)

					modal.empty()
					this.searchNewsContent(_html, doc)
					modal.show()
				}
			}
		})
		xhr.send()
	}

	searchNewsContent(_html, doc) {
		const modal = this.shadowRoot.querySelector(`modal-news`)		
		const div = doc.querySelector(`.content`)
		// Daum
		// doc.querySelectorAll(`.news_view p, .news_view img`).forEach(element => {
		// 	div.appendChild(element)					
		// })

		// Naver 인쇄모드
		console.info(`HTML: `, div)
		modal.countImg(doc)
		modal.addContent(`.news-header`, this.getPressLogo(div))
		modal.addContent(`.news-header`, this.getTitle(div))
		modal.addContent(`.news-header`, this.getInputTime(div))
		modal.addContent(`.news-body`, this.getNewsContent(div))
		return div		
	}

	getTitle(div) {
		console.info(`TITLE: `, div.querySelector(`h3`))
		return div.querySelector(`h3`)
	}

	getPressLogo(a) {
		console.info(`Press Logo: `, a.querySelector(`.press_logo`))
		return a.querySelector(`.press_logo`)
	}

	getInputTime(span) {
		console.info(`Input Time: `,span.querySelector(`.t11`))
		return span.querySelector(`.t11`)
	}

	getNewsContent(div){		
		const result = document.createElement(`div`)
		let _div = div
		result.classList.add(`news-inner`)
		console.groupCollapsed(`BODY`)
		_div = this.deleteAdAnchor(_div)
		Array.from(_div.querySelector(`.article_body`).childNodes).forEach(element => {
			let _element = element
			if (_element.localName === `br`) {
				return
			}
			_element = this.textToParagraph(_element)

			console.info(_element)
			result.appendChild(_element.cloneNode(true))
		})
		console.groupEnd()
		console.info(`BODY-RESULT: `, result)
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
		console.info(`Image File: `,img.querySelectorAll(`img:not([src*="logo"])`))
		return img.querySelectorAll(`img:not([src*="logo"])`)
	}

	render() {
		return html` 
		${style}
		<div id="pageMain">			
			<img class="logo" src="/src/img/logo.png" width="270"/>
			<h1 class="site-description">뉴스 기사를 한 화면에!</h1>
			<input type="search" name="search" placeholder="보고싶은 기사의 URL을 입력해주세요." class="animated-search-form type-url">
        </div>
		<modal-news />
        `
	}
}

const style = html`
<style>	
#pageMain {
	display: grid;
	width: 95vw;
	margin: auto;
	margin-bottom: 100px;
}

#pageMain > * {
	display: block;
	margin-left: auto;
	margin-right: auto;
}

#pageMain * {
	font-family: 'Noto Sans KR', sans-serif;
}

.logo {
	box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
}

.site-description {
	color: #3498DB;
    text-align: center;
    margin: 1vh 0;
	font-size: 2em;
	font-weight: bold;
}

.animated-search-form[type=search] {
  margin-top: 40px;
  width: 500px;
  max-width: 95vw;
  border: 0.125rem solid #e6e6e6;
  box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
  border-radius: 0;
  padding: 0.75rem 1.25rem 0.75rem 2rem;
  transition: width 0.4s ease-in-out;
  line-height: 0;
}

</style>
`

customElements.define(`page-main`, PageMain)
