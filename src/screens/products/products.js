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
    loadData: async (page, pageSize) => {
      await loadProducts(productsTable, page, pageSize);
    },
  });

  const sbProducts = new SearchBar({
    container: document.getElementById("searchBarProducts"),
    placeholder: "Buscar productos",
    onSearch: async (toSearch) => {
      loadProducts(productsTable, null, null, toSearch);
    },
    onClear: () => {
      loadProducts(productsTable);
    },
  });

  loadProducts(productsTable);

  // Load products from main process
  async function loadProducts(
    table,
    page = 1,
    pageSize = 10,
    toSearch = sbProducts.lastSearch
  ) {
    const response = await ipcRenderer.invoke("products:get", {
      page,
      pageSize,
      toSearch,
    });
    if (toSearch !== "" && page === null && pageSize === null) {
      table.currentPage = 1;
    }

    table.setData(response.data, response.total);
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
