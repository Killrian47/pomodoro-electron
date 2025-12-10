import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface TimerSettings {
  workDuration: number
  breakDuration: number
  autoStart: boolean
  soundEnabled: boolean
}

export interface UserStats {
  totalSessions: number
  totalMinutes: number
  bestStreak: number
  currentStreak: number
}

export interface AppData {
  settings: TimerSettings
  stats: UserStats
}

const DEFAULT_DATA: AppData = {
  settings: {
    workDuration: 25,
    breakDuration: 5,
    autoStart: false,
    soundEnabled: true
  },
  stats: {
    totalSessions: 0,
    totalMinutes: 0,
    bestStreak: 0,
    currentStreak: 0
  }
}

const dir = join(app.getPath('userData'), 'pomodoro')
const file = join(dir, 'data.json')

// --- Fonctions de base ---

export function loadData(): AppData {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8')
    return DEFAULT_DATA
  }

  const raw = readFileSync(file, 'utf-8')
  try {
    return JSON.parse(raw) as AppData
  } catch {
    // En cas de fichier corrompu → reset
    writeFileSync(file, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8')
    return DEFAULT_DATA
  }
}

export function saveData(data: AppData): void {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
}

export function updateSettings(partial: Partial<TimerSettings>): TimerSettings {
  const data = loadData()
  const newSettings = { ...data.settings, ...partial }
  const newData: AppData = { ...data, settings: newSettings }
  saveData(newData)
  return newSettings
}

export function updateStats(partial: Partial<UserStats>): UserStats {
  const data = loadData()
  const newStats = { ...data.stats, ...partial }
  const newData: AppData = { ...data, stats: newStats }
  saveData(newData)
  return newStats
}
