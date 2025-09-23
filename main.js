const { app, BrowserWindow } = require("electron/main");
const path = require("path");


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false, // remove top bar
    backgroundColor: "#00000000",
    transparent: true, //
    webPreferences: {
      preload: path.join(__dirname, "src/renderer.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("src/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
