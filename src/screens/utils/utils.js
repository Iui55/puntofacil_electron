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

function formatDate(value) {
  const date = new Date(value * 1000);
  return date.toLocaleString(value);
}

function saleState(stateId) {
  return { 1: "Completada" }[stateId];
}

module.exports = {
  sendNotification,
  formatMoney,
  formatDate,
  saleState,
};
