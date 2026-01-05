import React, { useEffect, useRef, useState } from 'react'
import TimerView from './TimerView'
import type { Settings, Stats } from '../types/storage'

type Mode = 'work' | 'break'
const PRE_BREAK_DURATION = 5

const Timer: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [mode, setMode] = useState<Mode>('work')
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [preBreakSeconds, setPreBreakSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const preBreakRef = useRef<number | null>(null)
  const finishingRef = useRef(false)
  const modeRef = useRef<Mode>(mode)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  // Charger les settings au démarrage
  useEffect(() => {
    const load = async (): Promise<void> => {
      const [s, st] = await Promise.all([window.api.getSettings(), window.api.getStats()])
      setSettings(s)
      setStats(st)
      setSecondsRemaining(s.workDuration * 60)
    }
    load()
  }, [])

  const playBeep = (): void => {
    if (!settings?.soundEnabled) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.value = 0.1
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
    osc.onended = () => ctx.close()
  }

  const clearMainInterval = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const clearPreBreak = (): void => {
    if (preBreakRef.current !== null) {
      clearInterval(preBreakRef.current)
      preBreakRef.current = null
    }
    setPreBreakSeconds(null)
  }

  const pause = (): void => {
    setIsRunning(false)
    clearMainInterval()
  }

  useEffect(
    () => () => {
      clearMainInterval()
      clearPreBreak()
    },
    []
  )

  const startMainCountdown = (forceStart = false): void => {
    if (!settings || intervalRef.current !== null || (!forceStart && preBreakSeconds !== null))
      return
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

  const start = (): void => {
    if (!settings) return
    finishingRef.current = false

    if (secondsRemaining <= 0) {
      const nextSeconds = mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60
      setSecondsRemaining(nextSeconds)
    }

    startMainCountdown()
  }

  const reset = (): void => {
    if (!settings) return
    pause()
    clearPreBreak()
    finishingRef.current = false
    const nextSeconds = mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60
    setSecondsRemaining(nextSeconds)
  }

  const switchMode = (next: Mode): void => {
    if (!settings || isRunning || intervalRef.current !== null || preBreakSeconds !== null) return
    pause()
    clearPreBreak()
    finishingRef.current = false
    setMode(next)
    const nextSeconds = next === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60
    setSecondsRemaining(nextSeconds)
  }

  const startPreBreak = (): void => {
    clearPreBreak()
    setPreBreakSeconds(PRE_BREAK_DURATION)
    playBeep()
    preBreakRef.current = window.setInterval(() => {
      setPreBreakSeconds((prev) => {
        if (prev === null) return prev
        if (prev <= 1) {
          clearPreBreak()
          if (settings) {
            console.log(mode)
            setMode('break')
            console.log(mode)
            const breakSeconds = settings.breakDuration * 60
            setSecondsRemaining(breakSeconds)
            setIsRunning(false)
            startMainCountdown(true)
          }
          return null
        }
        playBeep()
        return prev - 1
      })
    }, 1000)
  }

  const onFinish = async (): Promise<void> => {
    if (finishingRef.current) return
    finishingRef.current = true
    pause()
    if (!settings) {
      finishingRef.current = false
      return
    }

    if (modeRef.current === 'work') {
      const result = await window.api.recordSession({
        type: 'work',
        durationMinutes: settings.workDuration
      })

      setStats(result.stats)

      startPreBreak()
    } else {
      clearMainInterval()
      clearPreBreak()
      setMode('work')
      setIsRunning(false)
      setSecondsRemaining(0)
    }

    finishingRef.current = false
  }

  const format = (s: number): string =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (!settings || !stats) {
    return <p>Chargement...</p>
  }

  const totalSeconds =
    preBreakSeconds !== null
      ? PRE_BREAK_DURATION
      : mode === 'work'
        ? settings.workDuration * 60
        : settings.breakDuration * 60

  const progress = (preBreakSeconds ?? secondsRemaining) / totalSeconds
  const displaySeconds = preBreakSeconds ?? secondsRemaining
  const label =
    preBreakSeconds !== null
      ? `Pause dans ${preBreakSeconds}s`
      : isRunning
        ? mode === 'work'
          ? 'Session en cours...'
          : 'Pause en cours...'
        : 'En pause'

  const viewProps = {
    formattedTime: format(displaySeconds),
    label,
    progress,
    onStart: start,
    onPause: pause,
    onReset: reset
  }

  return (
    <>
      <section className="mode-switch">
        <button
          className={`mode-btn ${mode === 'work' ? 'mode-btn--active' : ''}`}
          onClick={() => switchMode('work')}
        >
          Travail
        </button>
        <button
          className={`mode-btn ${mode === 'break' ? 'mode-btn--active' : ''}`}
          onClick={() => switchMode('break')}
        >
          Pause
        </button>
      </section>

      <div className={`timer-shell timer-shell--${mode}`}>
        <TimerView {...viewProps} />
      </div>

      <p className="bottom-text">
        Sessions terminées : <strong>{stats.totalSessions}</strong> | Minutes travaillées :{' '}
        <strong>{Math.round(stats.totalMinutes)}</strong>
      </p>
    </>
  )
}

export default Timer
