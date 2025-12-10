import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import '../style.css'

const App: React.FC = () => {
  const { pathname } = useLocation()
  const isTimer = pathname === '/' || pathname === '/timer'
  const isSettings = pathname === '/settings'
  const isHistory = pathname === '/history'

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Pomodoro</h1>
        <p className="app-subtitle">Concentre-toi sur une tâche à la fois.</p>

        <nav className="top-nav">
          <NavLink
            to="/timer"
            className={({ isActive }) => `nav-btn ${isActive || isTimer ? 'nav-btn--active' : ''}`}
          >
            Timer
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-btn ${isActive || isSettings ? 'nav-btn--active' : ''}`
            }
          >
            Réglages
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `nav-btn ${isActive || isHistory ? 'nav-btn--active' : ''}`
            }
          >
            Historique
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
