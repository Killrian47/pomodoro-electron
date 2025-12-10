import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import {
  loadData,
  updateSettings,
  updateStats,
  recordSession,
  AppData,
  TimerSettings,
  UserStats,
  SessionType
} from './db'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400, // adaptée à la largeur de la carte (380px) + marges
    height: 750, // valeur de départ, ajustée ensuite à la hauteur du HTML
    useContentSize: true,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL + '#/timer')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // Ajuste la taille de la fenêtre à la hauteur réelle du contenu
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) return
    try {
      const pageHeight: number = await mainWindow.webContents.executeJavaScript(
        'document.documentElement.scrollHeight'
      )
      // bornes pour éviter une fenêtre trop petite ou trop grande
      const finalHeight = Math.min(Math.max(Math.round(pageHeight), 600), 900)
      const [currentWidth] = mainWindow.getContentSize()
      mainWindow.setContentSize(currentWidth, finalHeight)
    } catch (err) {
      console.error('Erreur lors du calcul de la hauteur de page:', err)
    }
  })
}

// Ici on enregistre les routes "back"
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

  ipcMain.handle(
    'db:recordSession',
    (_event, payload: { type: SessionType; durationMinutes: number }) => {
      return recordSession(payload)
    }
  )
}

app.whenReady().then(() => {
  //console.log('userData path:', app.getPath('userData'))
  registerIpcHandlers() // important
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

Menu.setApplicationMenu(null);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
