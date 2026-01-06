/// <reference types="vite/client" />

import type { AppData, Settings, Stats, HistoryEntry, SessionType } from '../../shared/types'

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
      getSettings: () => Promise<Settings>
      getStats: () => Promise<Stats>
      getHistory: () => Promise<HistoryEntry[]>
      windowControls: {
        minimize: () => Promise<void>
        toggleMaximize: () => Promise<boolean>
        isMaximized: () => Promise<boolean>
        close: () => Promise<void>
        onWindowState: (callback: (isMaximized: boolean) => void) => () => void
      }
    }
  }
}

export {}
