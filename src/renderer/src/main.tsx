import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App' // page Timer
import TimerSettings from './components/TimerSettings' // page Settings

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/timer" element={<App />} />
        <Route path="/settings" element={<TimerSettings />} />
        {/* fallback au cas où */}
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
