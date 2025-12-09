import React, { useState } from 'react'
import '../style.css'
import Timer from './components/Timer'
import TimerSettings from './components/TimerSettings'

type View = 'timer' | 'settings'

const App: React.FC = () => {
  const [view, setView] = useState<View>('timer')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Pomodoro</h1>
        <p className="app-subtitle">Concentre-toi sur une tâche à la fois.</p>

        <div className="top-nav">
          <button
            className={`nav-btn ${view === 'timer' ? 'nav-btn--active' : ''}`}
            onClick={() => setView('timer')}
          >
            Timer
          </button>
          <button
            className={`nav-btn ${view === 'settings' ? 'nav-btn--active' : ''}`}
            onClick={() => setView('settings')}
          >
            Réglages
          </button>
        </div>
      </header>

      <main className="app-main">{view === 'timer' ? <Timer /> : <TimerSettings />}</main>
    </div>
  )
}

export default App
