(() => {
  const { ipcRenderer } = require("electron");
  const { formatDate, formatMoney, saleState } = require("../utils/utils.js");

  // ---- UI Components ----
  const reportBtn = document.getElementById("generateReportBtn");
  
  // ---- Components ----
  const SearchBar = require("../components/searchBar/searchBar.js");
  const TableData = require("../components/tableData/tableData.js");

  // ----- Components state -----
  const salesTable = new TableData({
    container: document.getElementById("salesTable"),
    headers: [
      { label: "No. Venta", key: "id" },
      { label: "Total", key: "total_price" },
      { label: "Estado", key: "state" },
      { label: "Fecha", key: "created_at" },
    ],
    data: [],
    mapRow: (data) => {
      return {
        ...data,
        id: String(data.id).padStart(10, "0"),
        created_at: formatDate(data.created_at),
        state: saleState(data.state),
        total_price: formatMoney(data.total_price),
      };
    },
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
  // src/screens/sales/sales-report.js
  // const filterSelect = document.getElementById("filterOption");
  // const rangePicker = document.getElementById("rangePicker");
  // const startInput = document.getElementById("startDate");
  // const endInput = document.getElementById("endDate");
  
  
  // filterSelect.addEventListener("change", () => {
    //   rangePicker.style.display =
    //     filterSelect.value === "range" ? "block" : "none";
    // });
    
  reportBtn.addEventListener("click", async () => {
      const res = await ipcRenderer.invoke("generate-sales-report", salesTable.data);
      console.log(res)
      if (res.ok) {
        alert("✅ Reporte generado correctamente.\nRuta: " + res.path);
      } else {
        alert("❌ Error al generar reporte: " + res.error);
      } 
  });
})();
