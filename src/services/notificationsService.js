const { BrowserWindow } = require("electron")

function sendNotification(message) {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
        mainWindow.webContents.send("app:notification", message);
    }
}

module.exports = { sendNotification };