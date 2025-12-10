import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { loadData, updateSettings, updateStats, AppData, TimerSettings, UserStats } from './db'

let mainWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    // Timer
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL + '#/timer')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

function createSettingsWindow(): void {
  settingsWindow = new BrowserWindow({
    width: 900,
    height: 900,
    title: 'Réglages timer',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    // Settings
    settingsWindow.loadURL(process.env.ELECTRON_RENDERER_URL + '#/settings')
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

// 🔌 Ici on enregistre les routes "back"
function registerIpcHandlers(): void {
  ipcMain.handle('db:get', (): AppData => {
    return loadData()
  })

  ipcMain.handle('db:updateSettings', (_event, partial: Partial<TimerSettings>): TimerSettings => {
    return updateSettings(partial)
  })

  ipcMain.handle('db:updateStats', (_event, partial: Partial<UserStats>): UserStats => {
    return updateStats(partial)
  })
}

ipcMain.on('window:openSettings', () => {
  createSettingsWindow()
})

app.whenReady().then(() => {
  //console.log('userData path:', app.getPath('userData'))
  registerIpcHandlers() // 👈 important
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
