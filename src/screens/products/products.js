const { BrowserWindow } = require("electron").remote;
const path = require("path");

document.addEventListener("DOMContentLoaded", () => {
  const btnRegister = document.getElementById("registerProductBtn");

  btnRegister.addEventListener("click", () => {
    const modal = new BrowserWindow({
      width: 650,
      height: 550,
      parent: require("electron").remote.getCurrentWindow(),
      modal: true,
      frame: false,
      resizable: false,
      backgroundColor: "#00000000", // transparente
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    modal.loadFile(path.join(__dirname, "product-form/product-form.html"));
  });
});
