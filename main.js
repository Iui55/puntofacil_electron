const { app, BrowserWindow, ipcMain } = require("electron/main");
const { runMigrations } = require("./src/data/database/migrations.js");
const notificationsService = require("./src/services/notificationsService.js");
const productsService = require("./src/services/productsService.js");
const salesService = require("./src/services/salesService.js");
// const userService = require("./src/services/userService.js");

const path = require("path");

let loginWindow;
let homeWindow;
// let productsWindow;
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
   PRODUCT ADD
=========================== */
const createProductAddWindow = (product) => {
  productAddWindow = new BrowserWindow({
    width: 650,
    height: 360,
    parent: homeWindow,
    modal: true,
    resizable: false,
    frame: false,
    transparent: true,
    roundedCorners: true,
    show: false,
    icon: path.join(__dirname, "assets/images/puntofacil.jpg"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [JSON.stringify(product)],
    },
  });

  productAddWindow.loadFile("src/screens/product-add/product-add.html");
  productAddWindow.on("open-product-ready", () => {
    productAddWindow.show();
  });

  productAddWindow.on("closed", () => {
    productAddWindow = null;
    homeWindow.webContents.send("modal-closed");
  });
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
ipcMain.on("open-product-add", (event, product) => {
  createProductAddWindow(product);
});

ipcMain.on("open-product-ready", () => {
  if (productAddWindow !== null) productAddWindow.show();
});

// Regresar de Product-Add a Products
ipcMain.on("back-to-products", () => {
  if (productAddWindow !== null) productAddWindow.close();
});

// ===== Products IPC handlers =====

ipcMain.on("products:updated", (event) => { // maybe unnecessary ???
  return homeWindow.webContents.send("products:update-list");
});

ipcMain.handle("products:get", (event, { page, pageSize, toSearch }) => {
  return productsService.getProducts(toSearch, page, pageSize);
});

ipcMain.handle("products:add", (evet, { data }) => {
  const response = productsService.addProduct(data, 1);
  if (response !== false)
    notificationsService.sendNotification(`Producto ${data.name} agregado`);

  return response;
});

ipcMain.handle("products:update", (evet, { data }) => {
  const response = productsService.updateProduct(data, 1);
  if (response !== false)
    notificationsService.sendNotification(`Producto ${data.name} actualizado`);

  return response; 
});

ipcMain.handle("products:delete", (evet, productId) => {
  const response = productsService.deleteProduct(productId, 1);
  if (response !== false) 
    notificationsService.sendNotification("Producto fue eliminado");

  return response;
});

// ===== Sales IPC handlers =====
ipcMain.handle("sales:getNextSaleNumber", (evet) => {
  return salesService.getLastSale().id + 1;
});

ipcMain.handle("sales:get", (evet, { page, pageSize, toSearch }) => {
  return salesService.getSales(toSearch, page, pageSize);
});

ipcMain.handle("sales:add", (evet, data) => {
  const response = salesService.addSale(data, 1);
    if (response !== false)
      notificationsService.sendNotification("Venta realizada");

  return response; 
});

app.whenReady().then(() => {
  runMigrations();
  createLoginWindow();
});
