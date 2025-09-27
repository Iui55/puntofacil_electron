(() => {
  const { ipcRenderer } = require("electron");
  const path = require("path");

  // Componentes
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  // ----- Components state -----
  const productsTable = new TableData({
    container: document.getElementById("productsTable"),
    headers: [
      { label: "Nombre producto", key: "name" },
      { label: "Código de barras", key: "id" },
      { label: "Stock", key: "stock" },
      { label: "Precio compra", key: "cost" },
      { label: "Precio venta", key: "price" },
    ],
    data: [],
  });

  const sbProducts = new SearchBar({
    container: document.getElementById("searchBarProducts"),
    placeholder: "Buscar productos",
    onSearch: async (toSearch) => {
      console.log("Searching for:", toSearch);
      const products = await ipcRenderer.invoke("products:get", { toSearch });
      productsTable.setData(products);
    },
    onClear: () => {
      console.log("Clearing search");
      loadProducts(productsTable);
    },
  });

  loadProducts(productsTable);
  
  
  // Load products from main process
  async function loadProducts(table) {
    const products = await ipcRenderer.invoke("products:getAll");
    table.setData(products);
  }

  // const btnRegister = document.getElementById("registerProductBtn");

  // btnRegister.addEventListener("click", () => {
  //   const modal = new BrowserWindow({
  //     width: 650,
  //     height: 550,
  //     parent: require("electron").remote.getCurrentWindow(),
  //     modal: true,
  //     frame: false,
  //     resizable: false,
  //     backgroundColor: "#00000000", // transparente
  //     webPreferences: {
  //       nodeIntegration: true,
  //       contextIsolation: false,
  //     },
  //   });

  //   modal.loadFile(path.join(__dirname, "product-form/product-form.html"));
  // });
})();
