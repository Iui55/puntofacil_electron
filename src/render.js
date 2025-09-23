window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = form.querySelector("input[type=text]").value;
    const password = form.querySelector("input[type=password]").value;

    if (usuario === "admin" && password === "1234") {
      alert("✅ Login correcto");
      // Aquí podrías redirigir a la pantalla de ventas
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  });
});
