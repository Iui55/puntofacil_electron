const { ipcRenderer } = require("electron");

const btnBack = document.getElementById("btn-back");

btnBack.addEventListener("click", () => {
  // Avisamos que queremos volver a la ventana de productos
  ipcRenderer.send("back-to-products");
});
