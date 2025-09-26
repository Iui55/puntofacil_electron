document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btn-back");

  // Cerrar modal al hacer clic en "Volver"
  btnBack.addEventListener("click", () => {
    window.close(); // Cierra solo esta ventana modal
  });
});
