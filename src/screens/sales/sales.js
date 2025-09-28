(() => {
  const path = require("path");
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  const sbSales = new SearchBar({
    container: document.getElementById("searchBarSales"),
    placeholder: "Buscar ventas",
  });

  // ----- Estado -----
  const SAMPLE_SALES = [];
  // Generar 60 ventas de prueba jejje ayñ
  for (let i = 1; i <= 60; i++) {
    SAMPLE_SALES.push({
      no_sale: 100000 + i,
      total: i % 4 === 0 ? 125 + (i % 3) * 5 : 230,
      state: i % 2 === 0 ? `Pagado` : `No pagado xd`,
      date: i % 5 === 0 ? `27/09/2025` : `30/09/2025`,
    });
  }

  const salesTable = new TableData({
    container: document.getElementById("salesTable"),
    headers: [
      { label: "No. Venta", key: "no_sale" },
      { label: "Total", key: "total" },
      { label: "Estado", key: "state" },
      { label: "Fecha", key: "date" },
    ],
    data: SAMPLE_SALES,
  });
})();
