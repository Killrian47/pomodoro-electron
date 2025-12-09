import React from 'react'
import '../style.css' // importe les styles globaux du dossier renderer
import Timer from './Timer'

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Pomodoro</h1>
        <p className="app-subtitle">Concentre-toi sur une tâche à la fois.</p>
      </header>

      <main className="app-main">
        <section className="mode-switch">
          <button className="mode-btn mode-btn--active">Travail</button>
          <button className="mode-btn">Pause</button>
        </section>

        <Timer workDuration={25} />

        <section className="bottom-info">
          <p className="bottom-text">
            Cycle actuel : <strong>1 / 4</strong>
          </p>
          <p className="bottom-text bottom-text--muted">
            Les stats et la logique arrivent juste après. 👀
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
