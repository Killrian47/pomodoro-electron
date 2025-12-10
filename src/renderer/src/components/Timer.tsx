import React, { useEffect, useRef, useState } from 'react'
import type { AppData } from '../types/storage'

const Timer: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const finishingRef = useRef(false)

  // Charger les settings au démarrage
  useEffect(() => {
    window.api.getData().then((d) => {
      setData(d)
      setSecondsRemaining(d.settings.workDuration * 60)
    })
  }, [])

  const totalSeconds = data ? data.settings.workDuration * 60 : 1

  const start = (): void => {
    if (!data || intervalRef.current !== null) return
    finishingRef.current = false
    setIsRunning(true)
    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev < 1) {
          onFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stop = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const pause = (): void => {
    setIsRunning(false)
    stop()
  }

  const reset = (): void => {
    if (!data) return
    pause()
    finishingRef.current = false
    setSecondsRemaining(data.settings.workDuration * 60)
  }

  const onFinish = async (): Promise<void> => {
    if (finishingRef.current) return
    finishingRef.current = true
    pause()
    if (!data) return

    const result = await window.api.recordSession({
      type: 'work',
      durationMinutes: data.settings.workDuration
    })

    setData((prev) =>
      prev ? { ...prev, stats: result.stats, history: [result.entry, ...prev.history] } : prev
    )
    // Tu pourras mettre une notif ici
  }

  useEffect(() => () => stop(), [])

  const format = (s: number): string =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (!data) {
    return <p>Chargement...</p>
  }

  const progress = secondsRemaining / totalSeconds

  return (
    <>
      <section className="mode-switch">
        <button className="mode-btn mode-btn--active">Travail</button>
        <button className="mode-btn">Pause</button>
      </section>

      <div className="timer-wrapper">
        <div
          className="timer-circle"
          style={{
            background: `conic-gradient(
              var(--accent) ${progress * 360}deg,
              rgba(0,0,0,0.35) 0deg
            )`
          }}
        >
          <div className="timer-inner">
            <span className="timer-time">{format(secondsRemaining)}</span>
            <span className="timer-label">{isRunning ? 'En cours...' : 'En pause'}</span>
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="control-btn control-btn--primary" onClick={start}>
          Start
        </button>
        <button className="control-btn" onClick={pause}>
          Pause
        </button>
        <button className="control-btn control-btn--danger" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="bottom-text">
        Sessions terminées : <strong>{data.stats.totalSessions}</strong> | Minutes :{' '}
        <strong>{data.stats.totalMinutes}</strong>
      </p>
    </>
  )
}

export default Timer
