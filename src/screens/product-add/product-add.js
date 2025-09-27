const { remote } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btn-back");

  // Botón Volver: cerrar la ventana actual
  btnBack.addEventListener("click", () => {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.close();
  });
});
