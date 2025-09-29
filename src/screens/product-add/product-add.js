document.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");

  const btnBack = document.getElementById("btn-back");
  const btnSave = document.getElementById("btn-save");

  btnBack.addEventListener("click", () => {
    // Avisamos que queremos volver a la ventana de productos
    ipcRenderer.send("back-to-products");
  });

  const form = document.getElementById("productForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // not reload page

    const data = Object.fromEntries(new FormData(form).entries());
    console.log(data);
    const response = await ipcRenderer.invoke("products:add", { data });
    if (response === false) console.log("error creating product");
  });
});
