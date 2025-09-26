document.addEventListener("DOMContentLoaded", () => {
  console.log("login.js form");
  document.getElementById("loginForm").addEventListener("submit", () => {
    try {
      // const user = document.getElementById("username").value;
      // const pass = document.getElementById("password").value;
      window.electronAPI.loginSuccess();
    } catch (error) {
      console.error("Error during login:", error);
    }
    // console.log("asdasdasd");
    // if (user === "admin" && pass === "1234") {
    //   window.electronAPI.loginSuccess();
    // } else {
    //   alert("Usuario o contraseña incorrectos");
    // }
  });
});
