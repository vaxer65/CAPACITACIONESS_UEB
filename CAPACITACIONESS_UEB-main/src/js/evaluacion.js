// =================================================================
// LÓGICA DE EVALUACIÓN Y CALIFICACIÓN
// =================================================================

// --- 1. TEST DEL MÓDULO ---
function enviarEvaluacion() {
  const radios1 = document.querySelectorAll('input[name="q1"]');
  const radios2 = document.querySelectorAll('input[name="q2"]');
  const resp1 = [...radios1].find((r) => r.checked);
  const resp2 = [...radios2].find((r) => r.checked);

  if (!resp1 || !resp2) {
    mostrarToast("⚠️ Por favor responde todas las preguntas antes de enviar.");
    return;
  }

  // Respuestas correctas: 1a, 2b
  let correctas = 0;
  if (resp1.value === "a") correctas++;
  if (resp2.value === "b") correctas++;

  if (correctas === 2) {
    mostrarToast(
      "🎉 ¡Excelente! Respondiste correctamente. Puedes avanzar al siguiente módulo.",
    );
    setTimeout(() => {
      window.location.href = "aula.html";
    }, 1500);
  } else {
    mostrarToast(
      `📚 Obtuviste ${correctas}/2 correctas. Revisa el material y vuelve a intentarlo.`,
    );
  }
}

// --- 2. SISTEMA DE ESTRELLAS ---
let estrellasSeleccionadas = 0;

function setStars(valor) {
  estrellasSeleccionadas = valor;
  document.querySelectorAll("#star-rating .star").forEach((star, i) => {
    star.classList.toggle("activa", i < valor);
  });
}

function enviarRetroalimentacion() {
  if (estrellasSeleccionadas === 0) {
    mostrarToast("⚠️ Por favor selecciona una calificación con las estrellas.");
    return;
  }
  mostrarToast(
    `⭐ ¡Gracias por tu retroalimentación de ${estrellasSeleccionadas} estrella(s)!`,
  );
}

// --- 3. TOAST (FEEDBACK VISUAL) ---
let toastTimeout;
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3200);
}
