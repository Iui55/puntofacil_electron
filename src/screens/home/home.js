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
  document.getElementById("salesBtn").addEventListener("click", () => {
    loadView("sales");
  });

  document.getElementById("productsBtn").addEventListener("click", () => {
    loadView("products");

  });

  // Vista inicial
  loadView("sales");
});
