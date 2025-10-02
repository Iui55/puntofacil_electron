document.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");
  const args = process.argv.slice(-1);
  const product = JSON.parse(args);
  let action = "add";
  // ---- UI Components ----
  const form = document.getElementById("productForm");
  const btnBack = document.getElementById("btn-back");
  const btnSave = document.getElementById("btn-save");

  // ---- Logic ----
  
  // If it's edit action
  if (product !== null) {
    action = "update"; 
    Object.keys(product).forEach((key) => {
      if (form.elements[key]) {
        form.elements[key].value = product[key];
      }
    });
    form.elements["id"].disabled = true;
    btnSave.textContent = "Actualizar"
  }

  // ---- Listeners ----
  btnBack.addEventListener("click", () => {
    // Avisamos que queremos volver a la ventana de productos
    ipcRenderer.send("back-to-products");
  });

  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault(); // not reload page

      const data = Object.fromEntries(new FormData(form).entries());
      data["id"] = form.elements["id"].value; // If it is disabled
      const response = await ipcRenderer.invoke(`products:${action}`, { data });
      if (response === false) {
        console.log("error creating product");
      }

      btnBack.click();
    },
    { once: true }
  );

  ipcRenderer.send("open-product-ready");
});
