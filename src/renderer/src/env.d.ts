/// <reference types="vite/client" />

import type { AppData, Settings, Stats, HistoryEntry, SessionType } from './types/storage'

declare global {
  interface Window {
    api: {
      getData: () => Promise<AppData>
      updateSettings: (partial: Partial<Settings>) => Promise<Settings>
      updateStats: (partial: Partial<Stats>) => Promise<Stats>
      recordSession: (payload: {
        type: SessionType
        durationMinutes: number
      }) => Promise<{ stats: Stats; entry: HistoryEntry }>
    }
  }
}

export {}
