// =================================================================
// LÓGICA DE CERTIFICADOS
// =================================================================

function descargarCert(nombreCurso) {
  mostrarToast(`⬇ Generando y descargando certificado: "${nombreCurso}"...`);

  // Aquí iría la lógica futura de conexión al backend o librería PDF (ej. jsPDF)
  setTimeout(() => {
    mostrarToast("✅ ¡Descarga completada!");
  }, 2000);
}

// --- TOAST (FEEDBACK VISUAL) ---
let toastTimeout;
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3200);
}
