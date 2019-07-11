import './components/page-main.js'

export class Main {
	static init() {
		this.loadingDOM()

		this.router()
			.isRoute()
			.otherwise()
			.pushUrl()
	}

	static router() {
		let path = location.pathname
		let isContinue = true
		if (path === `/`) {path = `/main`}		
		return {
			isRoute() {
				if (isContinue) {
					Main.renderPage(`page-${path.split(`/`)[1]}`, path)
					isContinue = false
				}
				return this
			},
			otherwise() {
				if (isContinue) {
					Main._onLoad(() => history.replaceState({}, null, `/main`))
					Main.renderPage(`page-main`, path)
					isContinue = false
				}
				return this
			},
			pushUrl() {
				if (isContinue) {	
					Main._onLoad(() => history.pushState({}, null, path))
				}
			},
		}
	}

	static _onLoad(callback) {
		window.addEventListener(`load`, () => {			
			callback()
		})
	}

	static loadingDOM() {
		const root = document.querySelector(`main`)
		const loading = document.createElement(`div`)
				
		this.emptyDOM()
		loading.classList.add(`loading`)
		for (let i=0; i < 5; i++) {
			loading.appendChild(document.createElement(`span`))
		}
		root.appendChild(loading)
	}

	static renderPage(pageName, path) {		
		this.emptyDOM()
		const pageElement = document.createElement(pageName)
		document.querySelector(`main`).appendChild(pageElement)
		history.pushState({}, pageName, path)
	}	

	static emptyDOM() {
		document.querySelector(`main`).innerHTML = ``	
	}

	static exceptDOM() {
		document.querySelector(`main`).innerHTML = `No Route`
	}

	static renderWaitMain(callback) {
		if (document.querySelector(`main`)) {
			callback()
		} else {
			Main._onLoad(() => {
				callback()
			})		
		}		
	}
}

Main.init()
