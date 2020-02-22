const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { autoUpdater } = require('electron-updater')

let mainWindow
let win

function createWindow () {
    win = new BrowserWindow({
        // frame: false,
        backgroundColor: '#eee',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            partition: 'persist:qortal'
        },
        // icon: Path.join(__dirname, '../', config.icon),
        autoHideMenuBar: true
    })
    // mainWindow = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     webPreferences: {
    //         nodeIntegration: true
    //     }
    // })
    // mainWindow.loadFile('index.html')
    win.loadURL('http://qor.tal')
    mainWindow.on('closed', function () {
        mainWindow = null
    })
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify()
    })
}

app.on('ready', () => {
    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() })
})

autoUpdater.on('update-available', () => {
    // mainWindow.webContents.send('update_available') // Not used at the moment...
    const n = new Notification({
        title: 'Update available',
        body: 'It will be downloaded in the background and installed on next restart'
    })
    n.show()
})

autoUpdater.on('update-downloaded', () => {
    // mainWindow.webContents.send('update_downloaded') // Not used at the moment
    const n = new Notification({
        title: 'Update downloaded',
        body: 'Restart your UI to update'
    })
    n.show()
})
