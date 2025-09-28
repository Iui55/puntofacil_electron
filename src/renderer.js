const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginSuccess: () => ipcRenderer.send("login-success"),
  onModalClosed: (callback) => ipcRenderer.on("modal-closed", callback),
  windowControl: (action) => ipcRenderer.send("window-control", action),
});
