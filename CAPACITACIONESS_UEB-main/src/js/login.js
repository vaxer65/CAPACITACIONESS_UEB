// =================================================================
// MAQUINA DE ESTADOS E INICIO DE SESIÓN MULTI-ROL
// =================================================================

let rolSeleccionado = "";

// --- Transición: De selección a formulario ---
function configurarLogin(rol) {
  rolSeleccionado = rol;

  // Ocultar selector, mostrar login card
  document.getElementById("pantalla-roles").style.display = "none";
  document.getElementById("pantalla-formulario").style.display = "block";

  const titulo = document.getElementById("login-titulo-dinamico");
  const desc = document.getElementById("login-desc-dinamica");
  const inputUser = document.getElementById("login-input-user");

  // Adaptar dinámicamente la UI de bienvenida según el rol seleccionado
  if (rol === "admin") {
    titulo.innerText = "Mesa de Control Admin";
    desc.innerText = "Acceso exclusivo para coordinadores y gestores TI.";
    inputUser.placeholder = "Ingrese identificador administrativo";
  } else if (rol === "docente") {
    titulo.innerText = "Portal del Cuerpo Docente";
    desc.innerText = "Habilitado para profesores y facilitadores de la UEB.";
    inputUser.placeholder = "ejemplo@ueb.edu.ec o 'docente'";
  } else {
    titulo.innerText = "Acceso Estudiantil";
    desc.innerText = "Ingresa tus credenciales de la UEB para continuar";
    inputUser.placeholder = "ejemplo@ueb.edu.ec o tu nombre";
  }
}

// --- Transición: Cancelar y regresar al menú de roles ---
function regresarASeleccion() {
  rolSeleccionado = "";
  document.getElementById("pantalla-formulario").style.display = "none";
  document.getElementById("pantalla-roles").style.display = "block";
}

// --- Validación y enrutamiento final ---
function ejecutarAutenticacion(event) {
  event.preventDefault();

  const userInput = document
    .getElementById("login-input-user")
    .value.trim()
    .toLowerCase();
  const passInput = document.getElementById("login-input-pass").value;
  const toast = document.getElementById("toast");

  if (!toast) return;

  // Validación básica de campos vacíos (Heurística de Nielsen)
  if (!userInput || !passInput) {
    mostrarMensaje("⚠️ Por favor completa todos los campos obligatorios.");
    return;
  }

  // Lógica inteligente de simulación basada en el rol seleccionado en el paso 1
  if (
    rolSeleccionado === "admin" &&
    (userInput === "admin" || userInput.includes("admin"))
  ) {
    mostrarMensaje("🔑 Credenciales de Administrador válidas. Redirigiendo...");
    setTimeout(() => (window.location.href = "admin/dashboard.html"), 1200);
  } else if (
    rolSeleccionado === "docente" &&
    (userInput === "docente" ||
      userInput.includes("docente") ||
      userInput.includes("@ueb.edu.ec"))
  ) {
    mostrarMensaje("👨‍🏫 Credenciales de Docente válidas. Redirigiendo...");
    setTimeout(() => (window.location.href = "docente/dashboard.html"), 1200);
  } else if (rolSeleccionado === "estudiante") {
    mostrarMensaje("🎓 Credenciales de Estudiante válidas. Redirigiendo...");
    setTimeout(
      () => (window.location.href = "estudiante/dashboard.html"),
      1200,
    );
  } else {
    mostrarMensaje(
      "⚠️ Error: El usuario ingresado no corresponde al rol seleccionado.",
    );
  }
}

function mostrarMensaje(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
