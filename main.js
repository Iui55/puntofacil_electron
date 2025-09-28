const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");

let loginWindow;
let homeWindow;
let productsWindow;
let productAddWindow;

/* ===========================
   LOGIN
=========================== */
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
  // loginWindow.webContents.openDevTools();
};

/* ===========================
   HOME
=========================== */
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

/* ===========================
   PRODUCTS
=========================== */
const createProductsWindow = () => {
  productsWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    resizable: false,
    frame: false,
    transparent: true,
    roundedCorners: true,
    icon: path.join(__dirname, "assets/images/puntofacil.jpg"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  productsWindow.loadFile("src/screens/products/products.html");
};

/* ===========================
   PRODUCT ADD
=========================== */
const createProductAddWindow = () => {
  productAddWindow = new BrowserWindow({
    width: 650,
    height: 550,
    resizable: false,
    frame: false,
    transparent: true,
    roundedCorners: true,
    icon: path.join(__dirname, "assets/images/puntofacil.jpg"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  productAddWindow.loadFile("src/screens/product-add/product-add.html");
};

/* ===========================
   IPC EVENTS
=========================== */

// Cuando el login es exitoso, cerrar login y abrir home
ipcMain.on("login-success", () => {
  if (loginWindow) loginWindow.close();
  createHomeWindow();
});

// Controles de ventana login
ipcMain.on("window-control", (event, action) => {
  if (action === "minimize") loginWindow.minimize();
  if (action === "maximize") {
    loginWindow.isMaximized()
      ? loginWindow.unmaximize()
      : loginWindow.maximize();
  }
  if (action === "close") loginWindow.close();
});

/* ===== Navegación Products <-> Product-Add ===== */

// Abrir Product-Add y cerrar Products
ipcMain.on("open-product-add", () => {
  if (productsWindow) productsWindow.close();
  createProductAddWindow();
});

// Regresar de Product-Add a Products
ipcMain.on("back-to-products", () => {
  if (productAddWindow) productAddWindow.close();
  createProductsWindow();
});

app.whenReady().then(createLoginWindow);
