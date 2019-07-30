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
			// this.loadXhr(url)
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
			this.switchURL(modal, host, _html, doc)
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
		const modal = this.shadowRoot.querySelector(`modal-news`)

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
					
					modal.empty()
					this.switchURL(modal, host, _html, doc)
					modal.show()
				}
			}
		})
		xhr.send()
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

		console.info(`HTML: `, div)
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

	/* Naver End */

	/* Daum Start */

	getTitleDaum(div) {
		console.info(`TITLE: `, div.querySelector(`h3`))
		return div.querySelector(`h3`)
	}

	getPressLogoDaum(img) {
		console.info(`Press Logo: `, img.querySelector(`.thumb_g`))
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
		console.info(`Input Time: `, resultSpan)
		return resultSpan		
	}

	getNewsContentDaum(dom) {			
		const article = dom.querySelector(`#harmonyContainer > section`)
		article.classList.add(`article-body`)
		
		console.info(`BODY-RESULT: `, article)
		return article		
	}

	getImageDaum(dom) {
		const imgs = dom.querySelectorAll(`#harmonyContainer > section img`)
		console.info(`Image File: `, imgs)
		return imgs
	}

	/* Daum End */


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
	width: fit-content;
	margin: auto;
	margin-bottom: 10vh;
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
	min-width: 15vw;
	width: 250px;
	max-width: 90vw;
}

.site-description {
	color: #3498DB;
    text-align: center;
    margin: 1vh 0;
	font-size: 2vw;
	font-weight: bold;
}

.animated-search-form[type=search] {
	margin-top: 10px;
	min-width: 30vw;
	width: 400px;
	max-width: 95vw;
	border: 0.125rem solid #e6e6e6;
	box-shadow: 0 0 3.125rem rgba(0, 0, 0, 0.18);
	border-radius: 0;
	padding: 0.75rem 1.25rem 0.75rem 2rem;
	transition: width 0.4s ease-in-out;
	line-height: 0;
	font-size: 0.7vw;	
}

</style>
`

customElements.define(`page-main`, PageMain)
