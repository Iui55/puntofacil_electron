const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");

let mainWindow;


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false, // remove top bar
    transparent: true, // To show rounded corner
    roundedCorners: true, // Windows 11+, macOS
    // backgroundColor: "#ffffff00",
    webPreferences: {
      preload: path.join(__dirname, "src/renderer.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("src/screens/login/login.html");
};

ipcMain.on("login-success", () => {
  console.log("asdasdasd");
  mainWindow.loadFile("src/screens/sales/sales.html");

});


ipcMain.on("window-control", (event, action) => {
  if (action === "minimize") mainWindow.minimize();
  if (action === "maximize") {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
  if (action === "close") mainWindow.close();
});

app.whenReady().then(createWindow);
