(() => {
  const { ipcRenderer } = require("electron");

  // ---- UI Components ----
  const btnRegister = document.getElementById("registerProductBtn");

  // ---- Componentes
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");
  const ModalMessage = require("../components/modalMessage/modalMessage.js");

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
        icon: "fa fa-pen",
        onClick: editProduct,
      },
      {
        label: "Eliminar",
        class: "delete",
        icon: "fa fa-trash",
        onClick: deleteProduct,
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

  const modal = new ModalMessage({
    container: document.getElementById("someModal"),
  });

  // ---- Renderers listeners ----
  ipcRenderer.on("products:update-list", ()=> {
    loadProducts(productsTable, productsTable.currentPage, 10);
  })
  
  // ---- Listeners Events ----
  btnRegister.addEventListener("click", () => {
    // Avisamos al proceso principal que queremos abrir product-add
    ipcRenderer.send("open-product-add", null);
    document.getElementById("overlay").style.display = "block";
  });

  // ---- Logic ----
  function editProduct(product) {
    ipcRenderer.send("open-product-add", { ...product });
    document.getElementById("overlay").style.display = "block";
  }

  async function deleteProduct(product) {
    modal.show({
      title: `Elimnar ${product.name}`,
      message: "¿Seguro que desea continuar?",
      onClickOption: async (isAgree) => {
        if (isAgree) {
          const response = await ipcRenderer.invoke("products:delete", product.id);
          loadProducts(productsTable, 1, 10);
        } 
      },
    });
  }

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
})();
