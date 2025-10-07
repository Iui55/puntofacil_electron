const { ipcRenderer } = require("electron");

function sendNotification(message, type = "warning") {
  ipcRenderer.send("notifications:push", {
    message: message,
    type: type,
  });
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

module.exports = {
  sendNotification,
  formatMoney,
};
