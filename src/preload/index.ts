import { contextBridge, ipcRenderer } from 'electron'
import type { AppData, TimerSettings, UserStats, SessionType, HistoryEntry } from '../main/db'

contextBridge.exposeInMainWorld('api', {
  getData: (): Promise<AppData> => ipcRenderer.invoke('db:get'),
  updateSettings: (partial: Partial<TimerSettings>): Promise<TimerSettings> =>
    ipcRenderer.invoke('db:updateSettings', partial),
  updateStats: (partial: Partial<UserStats>): Promise<UserStats> =>
    ipcRenderer.invoke('db:updateStats', partial),
  recordSession: (payload: {
    type: SessionType
    durationMinutes: number
  }): Promise<{
    stats: UserStats
    entry: HistoryEntry
  }> => ipcRenderer.invoke('db:recordSession', payload),
  getSettings: (): Promise<TimerSettings> => ipcRenderer.invoke('db:getSettingsOnly'),
  getStats: (): Promise<UserStats> => ipcRenderer.invoke('db:getStatsOnly'),
  getHistory: (): Promise<HistoryEntry[]> => ipcRenderer.invoke('db:getHistoryOnly'),
  windowControls: {
    minimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: (): Promise<boolean> => ipcRenderer.invoke('window:toggleMaximize'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:isMaximized'),
    close: (): Promise<void> => ipcRenderer.invoke('window:close'),
    onWindowState: (callback: (isMaximized: boolean) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, isMaximized: boolean): void => {
        callback(isMaximized)
      }
      ipcRenderer.on('window:state', handler)
      return () => ipcRenderer.removeListener('window:state', handler)
    }
  }
})
