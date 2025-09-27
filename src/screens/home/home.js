document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
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
      console.log(oldScript);
      oldScript.remove();
    });
  };

  // Navigation buttons
  const salesBtn = document.getElementById("salesBtn");
  const productsBtn = document.getElementById("productsBtn");
  const newSaleBtn = document.getElementById("newSaleBtn");
  salesBtn.addEventListener("click", () => {
    //loadView("sales");
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
    loadView("sales");
    productsBtn.classList.remove("active");
    salesBtn.classList.remove("active");
    newSaleBtn.classList.add("active");
  });
  // Init view
  loadView("products");
});
