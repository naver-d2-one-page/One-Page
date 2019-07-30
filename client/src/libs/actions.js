import store from './store'
// import { render } from 'lit-html'
// import { Main } from '../main.js'

function actionCreator(action) {
	return function() {
		let state = store.getState()
		state = action(state, ...arguments)
		store.setState(state)
	}
}

// ===================================================== Test code

export const countAdd = actionCreator(state => {
	state.info.count === undefined
		? state.info.count = 0
		: state.info.count++
	return state
})

export const getData = actionCreator(state => {
	const db = firebase.firestore()

	db.collection(`TEST`).get().then(querySnapshot => {
		querySnapshot.forEach(doc => {
			console.info(doc.id, doc.data())
		})
	})
	
	return state
})

// ===================================================== Example

// export const route = actionCreator((state, _route) => {
// 	state.route = _route

// 	return state
// })

export const add = actionCreator((state, todo) => {
	state.todoList.push({
		title: todo,
		completed: false,
		id: `item-xxxxxxxxxxxx`.replace(/[x]/g, () => {
			const r = Math.random() * 16 | 0

			return r.toString(16)
		}),
	})

	return state
})

export const remove = actionCreator((state, id) => {
	state.todoList = state.todoList.filter(todo => todo.id !== id)

	return state
})

export const toggle = actionCreator((state, id) => {
	const todo = state.todoList.find(_todo => _todo.id === id)
	todo.completed = !todo.completed

	return state
})

export const replace = actionCreator((state, id, title) => {
	const todo = state.todoList.find(_todo => _todo.id === id)
	todo.title = title

	return state
})

export const toggleAll = actionCreator((state, completed) => {
	state.todoList.forEach(_todo => {
		_todo.completed = completed
	})

	return state
})

export const clearCompleted = actionCreator(state => {
	state.todoList = state.todoList.filter(todo => !todo.completed)

	return state
})
