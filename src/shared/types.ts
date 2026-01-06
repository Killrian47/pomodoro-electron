export interface Settings {
  workDuration: number
  breakDuration: number
  autoStart: boolean
  soundEnabled: boolean
}

export interface Stats {
  totalSessions: number
  totalMinutes: number
  bestStreak: number
  currentStreak: number
}

export type SessionType = 'work' | 'break'

export interface HistoryEntry {
  id: string
  type: SessionType
  durationMinutes: number
  completedAt: string
}

export interface AppData {
  settings: Settings
  stats: Stats
  history: HistoryEntry[]
}

export type TimerSettings = Settings
export type UserStats = Stats
