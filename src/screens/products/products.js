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
    actions: [
      {
        label: "Editar",
        class: "edit",
        icon: 'fa fa-pen',
        onClick: this.editProduct,
      },
      {
        label: "Eliminar",
        class: "delete",
        icon: "fa fa-trash",
        onClick: this.deleteProduct,
      },
    ],
    loadData: (page, pageSize) => {
      loadProducts(productsTable, page, pageSize);
    },
  });

  const sbProducts = new SearchBar({
    container: document.getElementById("searchBarProducts"),
    placeholder: "Buscar productos",
    onSearch: async (toSearch) => {
      loadProducts(productsTable, 1, productsTable.pageSize, toSearch);
    },
    onClear: () => {
      loadProducts(productsTable);
    },
  });

  // Load products from main process
  async function loadProducts(
    table,
    page = 1,
    pageSize = 10,
    toSearch = sbProducts.lastSearch || ""
  ) {
    const response = await ipcRenderer.invoke("products:get", {
      page,
      pageSize,
      toSearch,
    });

    table.currentPage = page;
    table.setData(response.data, response.total);
  }

  function editProduct(product) {

  }

  const btnRegister = document.getElementById("registerProductBtn");

  btnRegister.addEventListener("click", () => {
    // Avisamos al proceso principal que queremos abrir product-add
    ipcRenderer.send("open-product-add");
    document.getElementById("overlay").style.display = "block";
  });
})();
