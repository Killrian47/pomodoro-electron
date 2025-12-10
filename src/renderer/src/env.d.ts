/// <reference types="vite/client" />

import type { AppData, Settings, Stats } from './types/storage'

declare global {
  interface Window {
    api: {
      getData: () => Promise<AppData>
      updateSettings: (partial: Partial<Settings>) => Promise<Settings>
      updateStats: (partial: Partial<Stats>) => Promise<Stats>
      openSettingsWindow: () => Promise<void>
    }
  }
}

export {}
