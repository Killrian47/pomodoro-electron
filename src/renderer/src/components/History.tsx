import React, { useEffect, useState } from 'react'
import type { HistoryEntry } from '../types/storage'

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date inconnue'

  return date.toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const History: React.FC = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await window.api.getData()
      setEntries(data.history)
    } catch (err) {
      console.error(err)
      setError("Impossible de charger l'historique.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  if (loading) {
    return <p className="bottom-text">Chargement de l&apos;historique...</p>
  }

  return (
    <section className="history">
      <div className="history-header">
        <div>
          <h2 className="history-title">Historique des sessions</h2>
          <p className="history-subtitle">Toutes les entrées stockées dans la base locale.</p>
        </div>
        <button
          className="control-btn control-btn--primary"
          onClick={fetchHistory}
          disabled={loading}
        >
          Rafraîchir
        </button>
      </div>

      {error && <p className="bottom-text bottom-text--muted">{error}</p>}

      {entries.length === 0 ? (
        <div className="history-empty">
          <p className="history-empty__title">Aucune session enregistrée.</p>
          <p className="bottom-text bottom-text--muted">
            Lance un timer pour voir tes sessions apparaître ici.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <article key={entry.id} className="history-item">
              <div className="history-item__top">
                <span className={`pill pill--${entry.type === 'work' ? 'work' : 'break'}`}>
                  {entry.type === 'work' ? 'Travail' : 'Pause'}
                </span>
                <span className="history-date">{formatDate(entry.completedAt)}</span>
              </div>
              <div className="history-item__bottom">
                <span className="history-duration">{entry.durationMinutes} min</span>
                <span className="history-note">Durée enregistrée</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default History
