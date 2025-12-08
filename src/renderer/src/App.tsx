import React from "react";
import '../style.css' // importe les styles globaux du dossier renderer

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

        <section className="timer-wrapper">
          <div className="timer-circle">
            {/* Valeurs statiques pour l'instant, on branchera la logique après */}
            <span className="timer-time">25:00</span>
            <span className="timer-label">Session de travail</span>
          </div>
        </section>

        <section className="controls">
          <button className="control-btn control-btn--primary">Start</button>
          <button className="control-btn">Pause</button>
          <button className="control-btn control-btn--danger">Reset</button>
        </section>

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
  );
};

export default App;
