import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppData,
  TimerSettings,
  UserStats,
  SessionType,
  HistoryEntry
} from '../main/db'

contextBridge.exposeInMainWorld('api', {
  getData: (): Promise<AppData> => ipcRenderer.invoke('db:get'),
  updateSettings: (partial: Partial<TimerSettings>): Promise<TimerSettings> =>
    ipcRenderer.invoke('db:updateSettings', partial),
  updateStats: (partial: Partial<UserStats>): Promise<UserStats> =>
    ipcRenderer.invoke('db:updateStats', partial),
  recordSession: (payload: { type: SessionType; durationMinutes: number }): Promise<{
    stats: UserStats
    entry: HistoryEntry
  }> => ipcRenderer.invoke('db:recordSession', payload),
  getSettings: (): Promise<TimerSettings> => ipcRenderer.invoke('db:getSettingsOnly'),
  getStats: (): Promise<UserStats> => ipcRenderer.invoke('db:getStatsOnly'),
  getHistory: (): Promise<HistoryEntry[]> => ipcRenderer.invoke('db:getHistoryOnly')
})
