// =================================================================
// LÓGICA DEL AULA VIRTUAL (CORREGIDA)
// =================================================================

const modulosCurso = [
  { titulo: "Módulo 1: Introducción a Microservicios", progreso: 20 },
  { titulo: "Módulo 2: Configuración del Entorno con Vite", progreso: 40 },
  { titulo: "Módulo 3: Arquitectura y APIs RESTful", progreso: 60 },
  { titulo: "Módulo 4: Contenedores y Bases de Datos", progreso: 80 },
  { titulo: "Módulo 5: Despliegue y Evaluación Final", progreso: 100 },
];

let indiceModuloActual = 0;

document.addEventListener("DOMContentLoaded", () => {
  inicializarAula();
});

function inicializarAula() {
  const contenedor = document.getElementById("modulos-dots");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  modulosCurso.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "modulo-dot";
    dot.title = modulosCurso[i].titulo;
    dot.onclick = () => irAModulo(i);
    contenedor.appendChild(dot);
  });
  actualizarAulaUI();
}

function actualizarAulaUI() {
  const modulo = modulosCurso[indiceModuloActual];

  // Actualizar título dinámico
  const tituloEl = document.getElementById("aula-titulo");
  if (tituloEl) {
    tituloEl.innerHTML = `<strong>${modulo.titulo}</strong><br>
         <span style="font-size:13px;font-weight:normal;opacity:0.7;">[Visualizador de video sin distracciones]</span>`;
  }

  // Actualizar barra de progreso filling
  const barraEl = document.getElementById("aula-progreso-barra");
  if (barraEl) barraEl.style.width = `${modulo.progreso}%`;

  const textoEl = document.getElementById("aula-progreso-texto");
  if (textoEl) textoEl.innerText = `${modulo.progreso}% completado`;

  // Actualizar clases de los indicadores secuenciales (puntos)
  const dots = document.querySelectorAll(".modulo-dot");
  dots.forEach((dot, i) => {
    dot.className = "modulo-dot";
    if (i < indiceModuloActual) dot.classList.add("completado");
    if (i === indiceModuloActual) dot.classList.add("actual");
  });
}

function cambiarModulo(direccion) {
  const anterior = indiceModuloActual;
  indiceModuloActual = Math.max(
    0,
    Math.min(modulosCurso.length - 1, indiceModuloActual + direccion),
  );

  if (indiceModuloActual === anterior && direccion > 0) {
    mostrarToast(
      "🎉 ¡Has completado todos los módulos! Procede a la Evaluación Final.",
    );
    return;
  }

  actualizarAulaUI();

  if (direccion > 0) {
    mostrarToast(`✅ Avanzando a: ${modulosCurso[indiceModuloActual].titulo}`);
  }
}

function irAModulo(indice) {
  indiceModuloActual = indice;
  actualizarAulaUI();
}

function irAEvaluacion() {
  window.location.href = "evaluacion.html";
}

// --- UTILIDAD DE TOAST (FEEDBACK) ---
let toastTimeout;
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3200);
}
