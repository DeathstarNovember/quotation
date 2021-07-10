import React, { useState } from 'react'
import './App.css'

const URL_BASE = 'https://zenquotes.io/'

const QUOTES_API_URL = `${URL_BASE}/api`

const OTD_API_URL = `https://apizen.date/`

const attributionText = 'powered by zenquotes.io'

type Mode = 'random' | 'today' | 'quotes' | 'onThisDay'

type Quote = {
  /** The quote text */
  q: string
  /** The name of the author of the quote. */
  a: string
  /** A preformatted HTML element for presenting the quote. */
  h: string
}

const App = () => {
  const quotes: Quote[] = []

  const [mode, setMode] = useState<undefined | Mode>(undefined)

  fetch(QUOTES_API_URL)

  return (
    <div className="App">
      {mode ? <div>{mode}</div> : null}
      <button
        onClick={() => {
          setMode('today')
        }}
      >
        Today
      </button>
      <button
        onClick={() => {
          setMode('random')
        }}
      >
        Random
      </button>
      <button
        onClick={() => {
          setMode('quotes')
        }}
      >
        List
      </button>
      <button
        onClick={() => {
          setMode('onThisDay')
        }}
      >
        On This Day
      </button>
      <p>
        <a href={URL_BASE}>{attributionText}</a>
      </p>
    </div>
  )
}

export default App
