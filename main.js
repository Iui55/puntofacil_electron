const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    frame: false, // Sin barra superior
    transparent: true, // Permitir esquinas redondeadas
    roundedCorners: true, // Solo aplica en Windows 11 y macOS
    webPreferences: {
      preload: path.join(__dirname, "src/renderer.js"),
      contextIsolation: true,
    },
  });

  // 🔹 Cargar directamente la pantalla de productos
  mainWindow.loadFile("src/screens/products/products.html");
};

// Evento cuando el login es exitoso (futuro)
ipcMain.on("login-success", () => {
  mainWindow.loadFile("src/screens/sales/sales.html");
});

// Controles de ventana personalizados
ipcMain.on("window-control", (event, action) => {
  if (action === "minimize") mainWindow.minimize();
  if (action === "maximize") {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
  if (action === "close") mainWindow.close();
});

app.whenReady().then(createWindow);
