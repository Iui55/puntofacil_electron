document.getElementById("loginForm").addEventListener("submit", () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  console.log("asdasdasd");
  if (user === "admin" && pass === "1234") {
    window.electronAPI.loginSuccess();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});
