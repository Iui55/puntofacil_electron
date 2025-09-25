// const loadView = async (viewName) => {
//   const base_file = `../${viewName}/${viewName}.html`;
//   const res = await fetch(`../${viewName}/${viewName}.html`);
//   const html = await res.text();
//   document.getElementById("content").innerHTML = html;

//   // Quitar CSS anterior (si existe)
//   const oldStyle = document.getElementById("dynamic-style");
//   if (oldStyle) oldStyle.remove();

//   // Agregar nuevo CSS (si existe)
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.href = cssPath;
//   link.id = "dynamic-style";
//   document.head.appendChild(link);
// };

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const loadView = async (view) => {
    const res = await fetch(view);
    const html = await res.text();
    content.innerHTML = html;
  };

  // Botones de la barra
  document.getElementById("salesBtn").addEventListener("click", () => {
    loadView("../sales/sales.html");
  });

  document.getElementById("productsBtn").addEventListener("click", () => {
    loadView("../products/products.html");
  });

  // Vista inicial
  loadView("../sales/sales.html");
});
