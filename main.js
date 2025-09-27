const { app, BrowserWindow, ipcMain } = require("electron/main");
const { runMigrations } = require("./src/data/database/migrations.js");
const { UsersRepo } = require("./src/data/repository/usersRepo.js");
const { ProductsRepo } = require("./src/data/repository/productsRepo.js");

const path = require("path");

let loginWindow;
let homeWindow;

const userRepo = new UsersRepo();
const productsRepo = new ProductsRepo();

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false, // remove top bar
    transparent: true, // To show rounded corner
    roundedCorners: true, // Windows 11+, macOS
    icon: path.join(__dirname, "assets/images/puntofacil.jpg"),
    webPreferences: {
      preload: path.join(__dirname, "src/renderer.js"),
      contextIsolation: true,
    },
  });

  loginWindow.loadFile("src/screens/login/login.html");
  //loginWindow.webContents.openDevTools();
};

const createHomeWindow = () => {
  homeWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    resizable: false,
    frame: false, // remove top bar
    transparent: true, // To show rounded corner
    roundedCorners: true, // Windows 11+, macOS
    icon: path.join(__dirname, "assets/images/puntofacil.jpg"),
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

app.whenReady().then(() => {
  runMigrations();
  createLoginWindow();
});
