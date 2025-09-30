(() => {
  const { ipcRenderer } = require("electron");
  const path = require("path");

  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  // ----- Components state -----
  const salesTable = new TableData({
    container: document.getElementById("salesTable"),
    headers: [
      { label: "No. Venta", key: "no_sale" },
      { label: "Total", key: "total" },
      { label: "Estado", key: "state" },
      { label: "Fecha", key: "date" },
    ],
    data: [],
    loadData: (page, pageSize) => {
      loadSales(salesTable, page, pageSize);
    },
  });

  const sbSales = new SearchBar({
    container: document.getElementById("searchBarSales"),
    placeholder: "Buscar ventas",
    onSearch: async (toSearch) => {
      loadSales(salesTable, 1, salesTable.pageSize, toSearch);
    },
    onClear: () => {
      loadSales(salesTable);
    },
  });

  // Load sales from main process
  async function loadSales(
    table,
    page = 1,
    pageSize = 10,
    toSearch = sbSales.lastSearch || ""
  ) {
    const response = await ipcRenderer.invoke("sales:get", {
      page,
      pageSize,
      toSearch,
    });

    table.currentPage = page;
    table.setData(response.data, response.total);
  }
  const btnRegister = document.getElementById("registerSalesBtn");

  btnRegister.addEventListener("click", () => {});
})();
