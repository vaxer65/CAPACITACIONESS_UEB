// =================================================================
// LÓGICA GENERAL DEL PORTAL DOCENTE (CAMPOS DE DURACIÓN Y PLANIFICACIÓN)
// =================================================================

let pasoActual = 1;
const totalPasos = 3;
let cursoSeleccionadoParaInscribir = "";
let modulosPropuesta = [];
let editandoCursoId = null;

function obtenerCursosGlobales() {
  return JSON.parse(localStorage.getItem("ueb_cursos")) || [];
}
function guardarCursosGlobales(lista) {
  localStorage.setItem("ueb_cursos", JSON.stringify(lista));
}

let alumnosMatriculados = [
  {
    id: 101,
    nombre: "Valentín Alexander Valle",
    progreso: 75,
    nota: 9.2,
    estado: "Aprobado",
  },
  {
    id: 102,
    nombre: "Jennifer Chávez Solís",
    progreso: 40,
    nota: 5.5,
    estado: "En riesgo",
  },
  {
    id: 103,
    nombre: "Carlos Narváez Pineda",
    progreso: 20,
    nota: 0.0,
    estado: "Reprobado",
  },
];

let hilosForo = [
  {
    id: 1,
    autor: "Valentín Alexander Valle",
    titulo: "Duda levantar contenedor Docker Compose",
    mensaje:
      "Ingeniero, buenas noches. Al ejecutar docker-compose up me sale conflicto de puertos en el 8080. ¿Cómo puedo cambiar el mapeo?",
    respuestas: [],
  },
];
let hiloActivoId = null;

document.addEventListener("DOMContentLoaded", () => {
  cambiarVistaDocente("cursos");
  renderizarNotas();
  renderizarHilosForo();
});

function renderizarCursosDocente() {
  const contenedor = document.getElementById("lista-cursos-docente");
  if (!contenedor) return;

  contenedor.innerHTML = `
        <div class="horizontal-card">
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80" alt="Software">
            <div class="card-body">
                <span class="tag tag-blue">Software</span>
                <h4 style="margin-top:5px;">Desarrollo de Microservicios</h4>
                <p class="text-muted text-sm" style="margin-top:2px;">Estado: <span class="text-green" style="font-weight:600;">✓ Dictándose en curso</span></p>
            </div>
            <div style="text-align: right; min-width: 140px;">
                <p class="font-bold blue-text" style="font-size:16px;">12 Alumnos</p>
                <span class="badge badge-blue" style="margin-top:5px;">Ciclo 2026</span>
            </div>
        </div>
    `;

  const cursosGlobales = obtenerCursosGlobales();
  const propuestos = cursosGlobales.filter(
    (c) => c.docente === "Ing. Carlitos Caiza",
  );

  propuestos.forEach((curso) => {
    let tagClass = "tag-blue";
    if (curso.categoria === "Marketing") tagClass = "tag-orange";
    if (curso.categoria === "Administración") tagClass = "tag-green";

    let estadoTexto = `<span class="orange-text" style="font-weight:600;">⏳ Enviado a revisión</span>`;
    if (curso.estado === "Aprobado") {
      estadoTexto = `<span class="text-green" style="font-weight:600;">✓ Aprobado e Impartiéndose</span>`;
    }

    const card = document.createElement("div");
    card.className = "horizontal-card";
    card.innerHTML = `
            <img src="${curso.foto}" alt="Curso">
            <div class="card-body">
                <span class="tag ${tagClass}">${curso.categoria}</span>
                <h4 style="margin-top:5px;">${curso.nombre}</h4>
                <p class="text-muted text-sm" style="margin-top:2px;">Estado: ${estadoTexto}</p>
            </div>
            <div style="text-align: right; min-width: 140px;">
                <p class="font-bold text-muted" style="font-size:13px;">${curso.duracionValor} ${curso.duracionTipo}</p>
                <button class="btn-outline btn-sm" style="margin-top: 5px; width: 100%; font-size:11px;" onclick="cargarEdicionCursoDocente(${curso.id})">✏️ Editar Estructura</button>
            </div>
        `;
    contenedor.appendChild(card);
  });
}

function agregarModuloDinamico() {
  const input = document.getElementById("input-nuevo-modulo");
  if (!input) return;
  const titulo = input.value.trim();
  if (!titulo) return;
  modulosPropuesta.push(titulo);
  input.value = "";
  renderizarModulosWizard();
}

function eliminarModuloDinamico(index) {
  modulosPropuesta.splice(index, 1);
  renderizarModulosWizard();
}

function renderizarModulosWizard() {
  const contenedor = document.getElementById("contenedor-modulos-dinamicos");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  if (modulosPropuesta.length === 0) {
    contenedor.innerHTML =
      '<p class="text-muted text-sm text-center" style="padding:15px; width:100%;">No has añadido módulos a la malla aún.</p>';
    return;
  }
  modulosPropuesta.forEach((mod, index) => {
    const item = document.createElement("div");
    item.className = "flex-between";
    item.style.background = "white";
    item.style.padding = "6px 10px";
    item.style.border = "1px solid var(--border-color)";
    item.style.borderRadius = "6px";
    item.style.width = "100%";
    item.innerHTML = `<span style="font-size:12px;">${mod}</span><span class="text-red" style="cursor:pointer;" onclick="eliminarModuloDinamico(${index})">🗑️</span>`;
    contenedor.appendChild(item);
  });
}

function cargarEdicionCursoDocente(id) {
  const database = obtenerCursosGlobales();
  const curso = database.find((c) => c.id === id);
  if (!curso) return;

  editandoCursoId = id;
  pasoActual = 1;

  document.getElementById("propuesta-nombre").value = curso.nombre;
  document.getElementById("propuesta-categoria").value = curso.categoria;
  document.getElementById("propuesta-horas").value = curso.horas;
  document.getElementById("propuesta-duracion-valor").value =
    curso.duracionValor || "";
  document.getElementById("propuesta-duracion-tipo").value =
    curso.duracionTipo || "Semanas";
  document.getElementById("propuesta-cronograma").value =
    curso.cronograma || "";
  document.getElementById("propuesta-modalidad").value = curso.modalidad;
  document.getElementById("propuesta-foto").value = curso.foto.includes(
    "photo-1434030216411",
  )
    ? ""
    : curso.foto;
  document.getElementById("propuesta-descripcion").value =
    curso.descripcion || "";

  modulosPropuesta = curso.modulos || [];
  renderizarModulosWizard();
  actualizarWizardUI();
  document.getElementById("modal-wizard-titulo").innerText =
    "Modificar Mi Curso";
  document.getElementById("modal-propuesta").classList.add("active");
}

function procesarEnvioFinal() {
  const nombre = document.getElementById("propuesta-nombre").value.trim();
  const categoria = document.getElementById("propuesta-categoria").value;
  const modalidad = document.getElementById("propuesta-modalidad").value;
  const horas =
    parseInt(document.getElementById("propuesta-horas").value) || 40;
  const duracionValor = document.getElementById(
    "propuesta-duracion-valor",
  ).value;
  const duracionTipo = document.getElementById("propuesta-duracion-tipo").value;
  const cronograma = document
    .getElementById("propuesta-cronograma")
    .value.trim();
  const desc = document.getElementById("propuesta-descripcion").value.trim();
  let foto = document.getElementById("propuesta-foto").value.trim();
  const video = document.getElementById("propuesta-video").value.trim();
  const material = document.getElementById("propuesta-material").value.trim();

  if (!foto)
    foto =
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80";

  let database = obtenerCursosGlobales();

  if (editandoCursoId !== null) {
    const curso = database.find((c) => c.id === editandoCursoId);
    if (curso) {
      curso.nombre = nombre;
      curso.categoria = categoria;
      curso.modalidad = modalidad;
      curso.horas = horas;
      curso.duracionValor = duracionValor;
      curso.duracionTipo = duracionTipo;
      curso.cronograma = cronograma;
      curso.descripcion = desc;
      curso.foto = foto;
      curso.modulos = modulosPropuesta;
      curso.video = video;
      curso.material = material;
      curso.estado = "Pendiente";
      mostrarToast(
        `📝 Cambios guardados. Remitido a verificación administrativa.`,
      );
    }
  } else {
    const nuevaPropuesta = {
      id: Date.now(),
      nombre,
      categoria,
      docente: "Ing. Carlitos Caiza",
      horas,
      cupos: 40,
      matriculados: 0,
      modalidad,
      duracionValor,
      duracionTipo,
      cronograma,
      estado: "Pendiente",
      foto,
      descripcion: desc,
      modulos: modulosPropuesta,
      video,
      material,
    };
    database.push(nuevaPropuesta);
    mostrarToast(`📨 Propuesta de "${nombre}" enviada con éxito.`);
  }

  guardarCursosGlobales(database);
  cerrarModalPropuesta();
  renderizarCursosDocente();
}

function validarPasoActual() {
  if (pasoActual === 1) {
    const nombre = document.getElementById("propuesta-nombre").value.trim();
    const horas = document.getElementById("propuesta-horas").value.trim();
    const val = document.getElementById("propuesta-duracion-valor").value;
    const crono = document.getElementById("propuesta-cronograma").value.trim();
    return nombre !== "" && horas !== "" && val !== "" && crono !== "";
  }
  if (pasoActual === 2 && modulosPropuesta.length === 0) {
    mostrarToast("⚠️ Debes añadir al menos un módulo.");
    return false;
  }
  return true;
}

function navegarPasos(direccion) {
  if (direccion === 1 && !validarPasoActual()) return;
  pasoActual += direccion;
  if (pasoActual > totalPasos) {
    procesarEnvioFinal();
    return;
  }
  actualizarWizardUI();
}
function actualizarWizardUI() {
  for (let i = 1; i <= totalPasos; i++) {
    if (document.getElementById(`paso-${i}`))
      document.getElementById(`paso-${i}`).style.display =
        i === pasoActual ? "block" : "none";
  }
  const txt = document.getElementById("wizard-progreso-texto");
  if (txt) txt.innerText = `Paso ${pasoActual} de 3`;
  const btnPrev = document.getElementById("btn-wizard-prev");
  if (btnPrev)
    btnPrev.style.visibility = pasoActual === 1 ? "hidden" : "visible";
  const btnNext = document.getElementById("btn-wizard-next");
  if (btnNext)
    btnNext.innerText =
      pasoActual === totalPasos ? "✓ Postular Curso" : "Siguiente →";
}
function cambiarVistaDocente(vista) {
  document
    .getElementById("link-cursos")
    .classList.toggle("active", vista === "cursos");
  document
    .getElementById("link-notas")
    .classList.toggle("active", vista === "notas");
  document
    .getElementById("link-foro")
    .classList.toggle("active", vista === "foro");
  document
    .getElementById("link-catalogo")
    .classList.toggle("active", vista === "catalogo");
  document.getElementById("vista-cursos").style.display =
    vista === "cursos" ? "block" : "none";
  document.getElementById("vista-notas").style.display =
    vista === "notas" ? "block" : "none";
  document.getElementById("vista-foro").style.display =
    vista === "foro" ? "block" : "none";
  document.getElementById("vista-catalogo").style.display =
    vista === "catalogo" ? "block" : "none";
  if (vista === "cursos") renderizarCursosDocente();
}
function renderizarNotas() {
  const tbody = document.getElementById("tabla-notas-alumnos");
  if (!tbody) return;
  tbody.innerHTML = "";
  alumnosMatriculados.forEach((al) => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #edf2f7";
    tr.innerHTML = `<td style="padding:15px;"><strong>${al.nombre}</strong></td><td style="padding:15px;">${al.progreso}%</td><td style="padding:15px;"><input type='number' step='0.1' value='${al.nota}' id='nota-${al.id}' class='form-input' style='width:70px; margin:0;'></td><td style="padding:15px;"><span class='tag tag-blue'>${al.estado}</span></td><td style="padding:15px; text-align:center;"><button class='btn-cta btn-sm' onclick='guardarNotaAlumno(${al.id})'>Asentar</button></td>`;
    tbody.appendChild(tr);
  });
}
function guardarNotaAlumno(id) {
  const input = document.getElementById(`nota-${id}`);
  if (!input) return;
  const al = alumnosMatriculados.find((a) => a.id === id);
  if (al) {
    al.nota = parseFloat(input.value);
    mostrarToast(`📝 Nota cargada para ${al.nombre}`);
  }
}
function renderizarHilosForo() {
  const c = document.getElementById("lista-hilos-foro");
  if (!c) return;
  c.innerHTML = "";
  hilosForo.forEach((h) => {
    const div = document.createElement("div");
    div.className = "course-card";
    div.style.padding = "15px";
    div.innerHTML = `<h4>${h.titulo}</h4><p class='text-muted text-sm'>Por: ${h.autor}</p>`;
    div.onclick = () => {
      document.getElementById("foro-texto-input").disabled = false;
      document.getElementById("foro-btn-enviar").disabled = false;
      document.getElementById("foro-chat-mensajes").innerHTML =
        `<div style='background:white; padding:10px; border-radius:8px;'><strong>${h.autor}:</strong><p>${h.mensaje}</p></div>`;
    };
    c.appendChild(div);
  });
}
function abrirModalInscripcionDocente(n) {
  cursoSeleccionadoParaInscribir = n;
  document.getElementById("modal-curso-nombre-doc").innerText = n;
  document.getElementById("modal-inscripcion-docente").classList.add("active");
}
function cerrarModalInscripcionDocente() {
  document
    .getElementById("modal-inscripcion-docente")
    .classList.remove("active");
}
function confirmarInscripcionDocente() {
  cerrarModalInscripcionDocente();
  mostrarToast(`🎉 Inscrito en: ${cursoSeleccionadoParaInscribir}`);
}
// --- FORO: Enviar respuesta del docente ---
function enviarRespuestaForo(event) {
  event.preventDefault();
  const input = document.getElementById("foro-texto-input");
  if (!input || !input.value.trim()) return;
  const mensajeTexto = input.value.trim();
  const chatEl = document.getElementById("foro-chat-mensajes");
  if (chatEl) {
    const burbuja = document.createElement("div");
    burbuja.style.cssText =
      "align-self:flex-end; background:linear-gradient(135deg,#003366,#004a8f); color:#fff; padding:10px 14px; border-radius:12px 12px 2px 12px; font-size:13px; max-width:80%; word-break:break-word;";
    burbuja.innerHTML = `<strong style="font-size:11px; opacity:0.75;">Ing. Carlitos Caiza (Docente):</strong><p style="margin-top:4px;">${mensajeTexto}</p>`;
    chatEl.appendChild(burbuja);
    chatEl.scrollTop = chatEl.scrollHeight;
  }
  input.value = "";
  mostrarToast("✅ Respuesta enviada al estudiante.");
}

// --- PROPUESTA: alias de envío por si el form hace submit directamente ---
function enviarPropuesta(event) {
  if (event) event.preventDefault();
  // No hacer nada: el wizard maneja el envío via navegarPasos()
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
  if (e.target === document.getElementById("modal-propuesta"))
    cerrarModalPropuesta();
  if (e.target === document.getElementById("modal-inscripcion-docente"))
    cerrarModalInscripcionDocente();
});
