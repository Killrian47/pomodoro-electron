import { contextBridge, ipcRenderer } from 'electron'
import type { AppData, TimerSettings, UserStats } from '../main/db'

contextBridge.exposeInMainWorld('api', {
  getData: (): Promise<AppData> => ipcRenderer.invoke('db:get'),
  updateSettings: (partial: Partial<TimerSettings>): Promise<TimerSettings> =>
    ipcRenderer.invoke('db:updateSettings', partial),
  updateStats: (partial: Partial<UserStats>): Promise<UserStats> =>
    ipcRenderer.invoke('db:updateStats', partial),
  openSettingsWindow: (): void => {
    ipcRenderer.send('window:openSettings')
  }
})
