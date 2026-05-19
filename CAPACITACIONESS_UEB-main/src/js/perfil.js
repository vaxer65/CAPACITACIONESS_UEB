// =================================================================
// LÓGICA DE PERFIL Y SOPORTE TÉCNICO
// =================================================================

// --- TOAST (FEEDBACK VISUAL) ---
let toastTimeout;
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");

  // Limpiamos formularios si es necesario
  const inputs = document.querySelectorAll(".form-input:not([readonly])");
  const textareas = document.querySelectorAll(".form-textarea");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    // Si fue un mensaje de soporte, limpiar el textarea
    if (mensaje.includes("Solicitud enviada")) {
      textareas.forEach((ta) => (ta.value = ""));
    }
  }, 3200);
}
