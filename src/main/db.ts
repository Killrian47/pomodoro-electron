import { randomUUID } from 'crypto'
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

export type SessionType = 'work' | 'break'

export interface HistoryEntry {
  id: string
  type: SessionType
  durationMinutes: number
  completedAt: string
}

export interface AppData {
  settings: TimerSettings
  stats: UserStats
  history: HistoryEntry[]
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
  },
  history: []
}

const dir = join(app.getPath('userData'), 'pomodoro')
const file = join(dir, 'data.json')

function normalizeData(raw: Partial<AppData> | null): AppData {
  return {
    settings: { ...DEFAULT_DATA.settings, ...(raw?.settings ?? {}) },
    stats: { ...DEFAULT_DATA.stats, ...(raw?.stats ?? {}) },
    history: raw?.history ?? []
  }
}

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
    const parsed = JSON.parse(raw) as Partial<AppData> | null
    const normalized = normalizeData(parsed)
    const needsSave =
      !parsed ||
      parsed.history === undefined ||
      parsed.settings?.autoStart === undefined ||
      parsed.settings?.soundEnabled === undefined ||
      parsed.stats?.bestStreak === undefined ||
      parsed.stats?.currentStreak === undefined

    if (needsSave) {
      saveData(normalized)
    }

    return normalized
  } catch {
    // En cas de fichier corrompu -> reset
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

export function recordSession(params: { type: SessionType; durationMinutes: number }): {
  stats: UserStats
  entry: HistoryEntry
} {
  const data = loadData()
  const entry: HistoryEntry = {
    id: randomUUID(),
    type: params.type,
    durationMinutes: params.durationMinutes,
    completedAt: new Date().toISOString()
  }

  const updatedStats: UserStats = {
    ...data.stats,
    totalSessions: data.stats.totalSessions + 1,
    totalMinutes: data.stats.totalMinutes + params.durationMinutes
  }

  const newData: AppData = { ...data, stats: updatedStats, history: [entry, ...data.history] }
  saveData(newData)

  return { stats: updatedStats, entry }
}
