// src/renderer/src/types/storage.ts

export interface Settings {
  workDuration: number // minutes
  breakDuration: number // minutes
  autoStart: boolean
  soundEnabled: boolean
}

export interface Stats {
  totalSessions: number
  totalMinutes: number
}

export interface AppData {
  settings: Settings
  stats: Stats
}
