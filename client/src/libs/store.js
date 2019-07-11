import createStore from './redux-zero.js'

const initialState = {
	info: [] , 
	todoList: [],
	login: false,
}
const store = createStore(initialState)

export default store
