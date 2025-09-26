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
      oldScript.remove();
    });
  };

  // Botones de la barra
  const salesBtn = document.getElementById("salesBtn");
  const productsBtn = document.getElementById("productsBtn");
  salesBtn.addEventListener("click", () => {
    loadView("sales");
    productsBtn.classList.remove("active");
    salesBtn.classList.add("active");
  });

  productsBtn.addEventListener("click", () => {
    loadView("products");
    salesBtn.classList.remove("active");
    productsBtn.classList.add("active");
  });

  // Vista inicial
  loadView("products");
});
