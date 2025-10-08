(() => {
  // src/screens/sales/sales-report.js
  const { ipcRenderer } = require("electron");

  const filterSelect = document.getElementById("filterOption");
  const rangePicker = document.getElementById("rangePicker");
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const reportBtn = document.getElementById("generateReportBtn");

  filterSelect.addEventListener("change", () => {
    rangePicker.style.display =
      filterSelect.value === "range" ? "block" : "none";
  });

  reportBtn.addEventListener("click", async () => {
    const option = filterSelect.value;
    const start = startInput.value;
    const end = endInput.value;

    // Tu fuente de datos, por ejemplo desde localStorage:
    const sales = JSON.parse(localStorage.getItem("pf_sales_records") || "[]");

    const res = await ipcRenderer.invoke("generate-sales-report", {
      sales,
      option,
      start,
      end,
    });

    if (res.ok) {
      alert("✅ Reporte generado correctamente.\nRuta: " + res.path);
    } else {
      alert("❌ Error al generar reporte: " + res.error);
    }
  });
})();
