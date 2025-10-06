const { ipcRenderer } = require("electron");

function sendNotification(message, type = "warning") {
  ipcRenderer.send("notifications:push", {
    message: message,
    type: type,
  });
}

module.exports = {
    sendNotification
}
