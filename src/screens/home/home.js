document.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");

  ipcRenderer.on("modal-closed", () => {
    document.getElementById("overlay").style.display = "none";
  });

  // ---- UI Components ----
  const content = document.getElementById("content");
  const notificationsContainer = document.getElementById("push-notifications");

  // Navigation buttons
  const salesBtn = document.getElementById("salesBtn");
  const productsBtn = document.getElementById("productsBtn");
  const newSaleBtn = document.getElementById("newSaleBtn");


  // ---- Renderers listeners ----
  ipcRenderer.on("app:notification", (event, message) => {
    const toast = document.createElement("div");
    toast.classList.add("notification");
    toast.textContent = message;

    notificationsContainer.appendChild(toast);
    
    // hide after
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s forwards";
      toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
  });

  // ---- Listeners Events ----
  salesBtn.addEventListener("click", () => {
    loadView("sales");
    productsBtn.classList.remove("active");
    salesBtn.classList.add("active");
    newSaleBtn.classList.remove("active");
  });

  productsBtn.addEventListener("click", () => {
    loadView("products");
    productsBtn.classList.add("active");
    salesBtn.classList.remove("active");
    newSaleBtn.classList.remove("active");
  });

  newSaleBtn.addEventListener("click", () => {
    loadView("saleform");
    productsBtn.classList.remove("active");
    salesBtn.classList.remove("active");
    newSaleBtn.classList.add("active");
  });

  // ---- Logic ----
  const loadView = async (view) => {
    mainPath = `../${view}/`;
    const res = await fetch(`${mainPath}${view}.html`);
    const html = await res.text();
    content.innerHTML = html;

    // Dynamic scripts
    const scripts = content.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      newScript.src = `${mainPath}${view}.js`;
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  };

  // Initial view
  loadView("products");
});
