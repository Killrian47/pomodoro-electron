import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Timer from './components/Timer'
import TimerSettings from './components/TimerSettings'
import History from './components/History'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Timer />} />
          <Route path="timer" element={<Timer />} />
          <Route path="settings" element={<TimerSettings />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Timer />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
