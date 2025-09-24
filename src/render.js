const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginSuccess: () => ipcRenderer.send("login-success"),
  windowControl: (action) => ipcRenderer.send("window-control", action),
});
