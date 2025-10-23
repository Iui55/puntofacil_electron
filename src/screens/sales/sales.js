(() => {
  const { ipcRenderer } = require("electron");
  const {
    formatDateTime,
    formatDate,
    formatMoney,
    saleState,
    buildDatePicker,
  } = require("../utils/utils.js");

  // ---- UI Components ----
  const reportBtn = document.getElementById("generateReportBtn");
  const dateFilter = document.getElementById("dateFilter");
  const rangeDate = buildDatePicker(document.getElementById("rangeDate"));

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
    pageSize: 10,
    mapRow: (data) => {
      return {
        ...data,
        id: String(data.id).padStart(10, "0"),
        created_at: formatDateTime(data.created_at),
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
      loadSales(salesTable, (pageSize = salesTable.pageSize));
    },
  });

  // ---- Listeners Events ----
  reportBtn.addEventListener("click", async () => {
    const [fromDate, toDate] = rangeDate.selectedDates;
    const res = await ipcRenderer.invoke("generate-sales-report", {
      toSearch: sbSales.lastSearch || "",
      fromDate: fromDate.getTime() / 1000,
      toDate: toDate.getTime() / 1000,
    });

    if (res.ok) {
      alert("✅ Reporte generado correctamente.\nRuta: " + res.path);
    } else {
      alert("❌ Error al generar reporte: " + res.error);
    }
  });

  dateFilter.addEventListener("change", (event) => {
    const selected = event.target.value;
    if (selected == "range") return;

    const { fromDate, toDate } = filterOptionToDates(selected);
    rangeDate.setDate([formatDate(fromDate), formatDate(toDate)], true);
  });

  rangeDate.config.onChange.push(function (selectedDates, dateStr, instance) {
    if (selectedDates.length < 2) return;

    loadSales(salesTable, 1, salesTable.pageSize);
  });

  rangeDate.config.onClose.push(function (selectedDates, dateStr, instance) {
    dateToFilterSelected(...selectedDates);
  });

  // ---- Logic ----
  async function loadSales(
    table,
    page = 1,
    pageSize = 10,
    toSearch = sbSales.lastSearch || "",
    filterDate = rangeDate.selectedDates
  ) {
    const [fromDate, toDate] = filterDate;
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    const filter = {
      toSearch,
      fromDate: fromDate.getTime() / 1000,
      toDate: toDate.getTime() / 1000,
    };

    const response = await ipcRenderer.invoke("sales:get", {
      page,
      pageSize,
      filter,
    });

    table.currentPage = page;
    table.setData(response.data, response.total);
  }

  function filterOptionToDates(option) {
    const toDate = new Date();
    const fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1); // This month
    switch (option) {
      case "today":
        fromDate.setDate(toDate.getDate());
        break;

      case "yesterday":
        fromDate.setDate(toDate.getDate() - 1);
        toDate.setDate(toDate.getDate() - 1);
        break;

      case "week":
        fromDate.setDate(toDate.getDate() - toDate.getDay() + 1);
        break;

      case "month":
        break;
    }

    return {
      fromDate,
      toDate,
    };
  }

  function dateToFilterSelected(selectedFromDate, selectedToDate) {
    selectedFromDate = selectedFromDate.toDateString();
    selectedToDate = selectedToDate.toDateString();
    const optionByRange = ["today", "yesterday", "week", "month"].find(
      (option) => {
        let { fromDate, toDate } = filterOptionToDates(option);

        return (
          selectedFromDate === fromDate.toDateString() &&
          selectedToDate == toDate.toDateString()
        );
      }
    );

    dateFilter.value = optionByRange || "range";
  }
})();
