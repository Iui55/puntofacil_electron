const { BrowserWindow } = require("electron")

function sendNotification(message, type="success") {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
        mainWindow.webContents.send("app:notification", {message, type});
    }
}

module.exports = { sendNotification };