(() => {
  const path = require("path");
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  const sbProducts = new SearchBar({
    container: document.getElementById("searchBarProducts"),
    placeholder: "Buscar productos",
  });

  // ----- Estado -----
  const SAMPLE_PRODUCTS = [];
  // Generar 60 productos de prueba
  for (let i = 1; i <= 60; i++) {
    SAMPLE_PRODUCTS.push({
      name: i % 4 === 0 ? `Refresco 600 ml. ${i}` : `Producto ${i}`,
      id: i,
      stock: Math.floor(5 + (i % 10) * 3),
      price: i % 5 === 0 ? 12.5 + (i % 3) * 5 : 25.0,
      cost: i % 3 === 0 ? 10.0 + (i % 4) * 4 : 15.0,
    });
  }

  const productsTable = new TableData({
    container: document.getElementById("productsTable"),
    headers: [
      { label: "Nombre producto", key: "name" },
      { label: "Código de barras", key: "id" },
      { label: "Stock", key: "stock" },
      { label: "Precio compra", key: "cost" },
      { label: "Precio venta", key: "price" },
    ],
    data: SAMPLE_PRODUCTS,
  });
  document.addEventListener("DOMContentLoaded", () => {
    const btnRegister = document.getElementById("registerProductBtn");

    btnRegister.addEventListener("click", () => {
      const currentWindow = remote.getCurrentWindow();

      // Crear ventana para "product-add"
      const productAddWindow = new BrowserWindow({
        width: 650,
        height: 550,
        frame: false,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });

      productAddWindow.loadFile(
        path.join(__dirname, "../product-add/product-add.html")
      );

      // Cerrar ventana actual
      currentWindow.close();
    });
  });
})();
