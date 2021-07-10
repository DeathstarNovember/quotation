import React from 'react'
import './App.css'

const URL_BASE = 'https://zenquotes.io/'

const QUOTES_API_URL = `${URL_BASE}/api/`

const OTD_API_URL = `https://apizen.date/`

const modes = ['random', 'today', 'quotes']

const attributionText = 'powered by zenquotes.io'

const App = () => {
  return (
    <div className="App">
      <p>
        <a href={URL_BASE}>{attributionText}</a>
      </p>
    </div>
  )
}

export default App
