import React from 'react'
import ReactDOM from 'react-dom'
import { it } from 'vitest'
import App from './App'

it('renders without crashing', (): void => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
