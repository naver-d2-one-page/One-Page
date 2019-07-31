import store from './store'
<<<<<<< HEAD
=======
// import { render } from 'lit-html'
// import { Main } from '../main.js'
>>>>>>> dfca6dc68710be43c4e70856e25b82ceea6d7ca8

function actionCreator(action) {
	return function() {
		let state = store.getState()
		state = action(state, ...arguments)
		store.setState(state)
	}
}

export const loadCors = actionCreator((state, url, callback) => {
	const xhr = new XMLHttpRequest()
	const _url = new URL(url)
	const host = _url.host
	const path = _url.pathname
	const search = _url.search

	if(!xhr) {
		throw new Error(`XHR 호출 불가`)
	}

	xhr.open(`GET`, `https://cors.kro.kr/cors/${host}${path}${search}`)
	xhr.setRequestHeader(`x-requested-with`, `XMLHttpRequest`)
	xhr.addEventListener(`readystatechange`, () => {
		if (xhr.readyState === xhr.DONE) {				
			if (xhr.status === 200 || xhr.status === 201) {
				callback(xhr.responseText)
			}
		}
	})
	xhr.send()
	return state
})

export const loadXhr = actionCreator((state, url, callback) => {
	const xhr = new XMLHttpRequest()

	if(!xhr) {
		throw new Error(`XHR 호출 불가`)
	}

	xhr.open(`GET`, url)
	xhr.setRequestHeader(`x-requested-with`, `XMLHttpRequest`)
	xhr.addEventListener(`readystatechange`, () => {
		if (xhr.readyState === xhr.DONE) {				
			if (xhr.status === 200 || xhr.status === 201) {
				callback(xhr.responseText)
			}
		}
	})
	xhr.send()
	return state
})
