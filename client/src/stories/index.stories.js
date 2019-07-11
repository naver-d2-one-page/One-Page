import { storiesOf } from '@storybook/polymer'
// import { document } from 'global'
import '../components/page-main.js'

storiesOf(`Page`, module)
	.add(`page-main`, () => `<page-main></page-main>`)

// storiesOf(`Demo`, module)
// 	.add(`heading`, () => `<h1>Hello World</h1>`)
// 	.add(`button`, () => {
// 		const button = document.createElement(`button`)
// 		button.type = `button`
// 		button.innerText = `Hello Button`
// 		button.addEventListener(`click`, e => console.log(e))
// 		return button
// 	})
