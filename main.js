const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");

let loginWindow;
let homeWindow;

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    frame: false, // remove top bar
    transparent: true, // To show rounded corner
    roundedCorners: true, // Windows 11+, macOS
    backgroundColor: "#ffffff00",
    webPreferences: {
      preload: path.join(__dirname, "src/renderer.js"),
      contextIsolation: true,
    },
  });

  loginWindow.loadFile("src/screens/login/login.html");
};

const createHomeWindow = () => {
  homeWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    frame: false, // remove top bar
    transparent: true, // To show rounded corner
    roundedCorners: true, // Windows 11+, macOS
    backgroundColor: "#ffffff00",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  homeWindow.loadFile("src/screens/home/home.html");
};

ipcMain.on("login-success", () => {
  if (loginWindow) loginWindow.close();

  createHomeWindow();
});

ipcMain.on("window-control", (event, action) => {
  if (action === "minimize") loginWindow.minimize();
  if (action === "maximize") {
    loginWindow.isMaximized()
      ? loginWindow.unmaximize()
      : loginWindow.maximize();
  }
  if (action === "close") loginWindow.close();
});

app.whenReady().then(createLoginWindow);
