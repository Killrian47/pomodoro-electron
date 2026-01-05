import React from 'react'

export interface TimerViewProps {
  formattedTime: string
  label: string
  progress: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

const TimerView: React.FC<TimerViewProps> = ({
  formattedTime,
  label,
  progress,
  onStart,
  onPause,
  onReset
}) => {
  return (
    <>
      <div className="timer-wrapper">
        <div
          className="timer-circle"
          style={{
            background: `conic-gradient(
              var(--timer-accent) ${progress * 360}deg,
              rgba(0,0,0,0.35) 0deg
            )`
          }}
        >
          <div className="timer-inner">
            <span className="timer-time">{formattedTime}</span>
            <span className="timer-label">{label}</span>
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="control-btn control-btn--primary" onClick={onStart}>
          Start
        </button>
        <button className="control-btn" onClick={onPause}>
          Pause
        </button>
        <button className="control-btn control-btn--danger" onClick={onReset}>
          Reset
        </button>
      </div>
    </>
  )
}

export default TimerView
