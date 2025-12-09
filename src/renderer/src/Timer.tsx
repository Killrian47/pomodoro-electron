/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect, CSSProperties } from 'react'

interface TimerProps {
  workDuration?: number // en minutes
}

const Timer: React.FC<TimerProps> = ({ workDuration = 25 }) => {
  const totalSeconds = workDuration * 60
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const start = (): void => {
    if (intervalRef.current !== null) return // déjà en cours
    setIsRunning(true)

    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          stop()
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
    pause()
    setSecondsRemaining(totalSeconds)
  }

  useEffect(() => stop, [])

  // 👇 Proportion restante (1 = plein, 0 = vide)
  const progress = secondsRemaining / totalSeconds

  // 👇 Style dynamique pour l’anneau (conic-gradient)
  const circleStyle: CSSProperties = {
    background: `conic-gradient(
      var(--accent) ${progress * 360}deg,
      rgba(0, 0, 0, 0.35) 0deg
    )`
  }

  return (
    <>
      <div className="timer-wrapper">
        <div className="timer-circle" style={circleStyle}>
          <div className="timer-inner">
            <span className="timer-time">{formatTime(secondsRemaining)}</span>
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
    </>
  )
}

export default Timer
