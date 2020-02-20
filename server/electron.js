const { app, BrowserWindow, ipcMain } = require('electron')

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
            partition: 'persist:karma'
        },
        icon: Path.join(__dirname, '../', config.icon),
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
    win.loadURL(url.format({
        pathname: config.primary.domain + ':' + config.primary.port + '/karma/' + config.plugins.default,
        protocol: config.primary.protocol + ':',
        slashes: true
    }))
    mainWindow.on('closed', function () {
        mainWindow = null
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
