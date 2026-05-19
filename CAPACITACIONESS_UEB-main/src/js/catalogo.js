// =================================================================
// LÓGICA DINÁMICA DEL CATÁLOGO DE CURSOS (ESTUDIANTE - DETALLES COMPLETOS)
// =================================================================

let tabActual = "Todos";

function obtenerCursosGlobales() {
  return JSON.parse(localStorage.getItem("ueb_cursos")) || [];
}

function obtenerMatriculasEstudiante() {
  return JSON.parse(localStorage.getItem("ueb_matriculas")) || [];
}

function guardarMatriculaEstudiante(nombreCurso) {
  let matriculas = obtenerMatriculasEstudiante();
  if (!matriculas.includes(nombreCurso)) {
    matriculas.push(nombreCurso);
    localStorage.setItem("ueb_matriculas", JSON.stringify(matriculas));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogoDinamico();
});

function renderizarCatalogoDinamico() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const cursos = obtenerCursosGlobales();
  const matriculas = obtenerMatriculasEstudiante();
  const termino = (document.getElementById("catalog-search")?.value || "")
    .toLowerCase()
    .trim();

  const aprobados = cursos.filter((c) => c.estado === "Aprobado");
  let visibles = 0;

  aprobados.forEach((curso) => {
    const matchTab = tabActual === "Todos" || curso.categoria === tabActual;
    const matchBusq = !termino || curso.nombre.toLowerCase().includes(termino);

    if (matchTab && matchBusq) {
      let tagClass = "tag-blue";
      if (curso.categoria === "Marketing") tagClass = "tag-orange";
      if (curso.categoria === "Administración") tagClass = "tag-green";

      const yaInscrito = matriculas.includes(curso.nombre);
      let botoneraHtml = `
                <div class="card-buttons">
                    <button class="btn-outline" onclick="abrirModalDetalles('${curso.nombre}')">Ver detalles</button>
                    <button class="btn-cta" onclick="abrirModalInscripcion('${curso.nombre}')">Inscribirse</button>
                </div>
            `;

      if (yaInscrito) {
        botoneraHtml = `
                    <div class="card-buttons" style="grid-template-columns: 1fr;">
                        <button class="btn-outline" disabled style="background: #ebf8ff; color: var(--blue-inst); border-color: #bee3f8; cursor: not-allowed; font-weight: 700; text-align: center;">✓ Ya estás Inscrito en este Curso</button>
                    </div>
                `;
      }

      const card = document.createElement("article");
      card.className = "vertical-card";
      card.innerHTML = `
                <img src="${curso.foto}" alt="${curso.nombre}">
                <div class="card-body">
                    <span class="tag ${tagClass} mb-10">${curso.categoria}</span>
                    <h4>${curso.nombre}</h4>
                    <p class="text-muted text-sm mt-10 mb-20">${curso.descripcion || "Sin descripción disponible."}</p>
                    <div class="flex-between text-sm text-muted mb-20">
                        <span>⏱️ ${curso.horas} horas</span><span>📅 ${curso.duracionValor || "4"} ${curso.duracionTipo || "Semanas"}</span>
                    </div>
                    ${botoneraHtml}
                </div>
            `;
      grid.appendChild(card);
      visibles++;
    }
  });

  const empty = document.getElementById("catalog-empty");
  if (empty) empty.style.display = visibles === 0 ? "block" : "none";
  const count = document.getElementById("catalog-count");
  if (count)
    count.textContent = `${visibles} Disponible${visibles !== 1 ? "s" : ""}`;
}

// --- NUEVO: MODAL EXPANDIDO DE REVISIÓN DE DETALLES ---
function abrirModalDetalles(nombreCurso) {
  const curso = obtenerCursosGlobales().find((c) => c.nombre === nombreCurso);
  if (!curso) return;

  // Reutilizaremos la estructura del modal inyectando la información detallada con la lista de módulos
  document.getElementById("modal-titulo").innerText =
    `${curso.nombre} (Plan de Estudios)`;
  document.getElementById("modal-docente").innerText = curso.docente;
  document.getElementById("modal-duracion").innerText =
    `${curso.duracionValor || "4"} ${curso.duracionTipo || "Semanas"} (${curso.horas} Horas)`;
  document.getElementById("modal-horario").innerText =
    curso.cronograma || "Planificación Flexible";

  // Inyectar desgloses de módulos en la sección informativa
  const contenedorAlerta = document.querySelector(".alert-blue");
  const modulosInternos = curso.modulos || [
    "Introducción y conceptos base",
    "Laboratorios experimentales",
    "Evaluación integral",
  ];

  contenedorAlerta.innerHTML = `<strong>Contenido Temático Requerido:</strong><br>
    <ul style='padding-left:15px; margin-top:5px; font-weight:normal; font-size:12px;'>
        ${modulosInternos.map((m) => `<li>${m}</li>`).join("")}
    </ul>`;

  document.getElementById("modal-inscripcion").classList.add("active");
}

function abrirModalInscripcion(nombreCurso) {
  const curso = obtenerCursosGlobales().find((c) => c.nombre === nombreCurso);
  if (!curso) return;

  document.getElementById("modal-titulo").innerText = nombreCurso;
  document.getElementById("modal-docente").innerText = curso.docente;
  document.getElementById("modal-duracion").innerText =
    `${curso.horas} horas académicas`;
  document.getElementById("modal-horario").innerText =
    curso.cronograma || "Horario Flexible";

  const tagEl = document.getElementById("modal-tag");
  tagEl.className = "tag mb-10";
  tagEl.innerText = curso.categoria;
  if (curso.categoria === "Software") tagEl.classList.add("tag-blue");
  else if (curso.categoria === "Marketing") tagEl.classList.add("tag-orange");
  else tagEl.classList.add("tag-green");

  // Restaurar aviso estándar
  document.querySelector(".alert-blue").innerHTML =
    `ℹ️ Al confirmar la inscripción, este curso aparecerá automáticamente en tu Dashboard y Aula Virtual.`;

  document.getElementById("modal-inscripcion").classList.add("active");
}

function cerrarModal() {
  document.getElementById("modal-inscripcion").classList.remove("active");
}
function confirmarInscripcion() {
  const t = document.getElementById("modal-titulo").innerText;
  if (t.includes("Plan de Estudios")) {
    cerrarModal();
    return;
  }
  guardarMatriculaEstudiante(t);
  cerrarModal();
  renderizarCatalogoDinamico();
  mostrarToast(`🎉 ¡Matrícula registrada con éxito en "${t}"!`);
}
function cambiarTab(el, cat) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  tabActual = cat;
  renderizarCatalogoDinamico();
}
function filtrarCatalogo() {
  renderizarCatalogoDinamico();
}
function resetCatalogo() {
  tabActual = "Todos";
  document
    .querySelectorAll(".tab")
    .forEach((t, i) => t.classList.toggle("active", i === 0));
  if (document.getElementById("catalog-search"))
    document.getElementById("catalog-search").value = "";
  renderizarCatalogoDinamico();
}
function mostrarToast(m) {
  const t = document.getElementById("toast");
  if (t) {
    t.textContent = m;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3200);
  }
}
document.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-inscripcion")) cerrarModal();
});
