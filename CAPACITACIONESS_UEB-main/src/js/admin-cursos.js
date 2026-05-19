// =================================================================
// LÓGICA DE GESTIÓN DE CURSOS - ADMINISTRADOR (AUDITORÍA DE PROPUESTAS)
// =================================================================

function obtenerCursosGlobales() {
  const datos = localStorage.getItem("ueb_cursos");
  const predeterminados = [
    {
      id: 1,
      nombre: "Desarrollo de Aplicaciones con React",
      categoria: "Software",
      docente: "Ing. Carlos Méndez",
      horas: 45,
      duracionValor: "4",
      duracionTipo: "Semanas",
      cronograma: "Lunes y Miércoles 18:00 - 20:00",
      cupos: 150,
      matriculados: 142,
      modalidad: "Virtual",
      estado: "Aprobado",
      foto: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
      descripcion:
        "Aprende a construir interfaces de usuario dinámicas y escalables.",
      modulos: [
        "Módulo 1: JSX y Componentes",
        "Módulo 2: State y useEffect",
        "Módulo 3: Hooks y Enrutamiento",
      ],
    },
    {
      id: 2,
      nombre: "Estrategias de Marketing Digital 2026",
      categoria: "Marketing",
      docente: "Lic. Roberto Sanz",
      horas: 30,
      duracionValor: "3",
      duracionTipo: "Semanas",
      cronograma: "Martes y Jueves 19:00 - 21:00",
      cupos: 100,
      matriculados: 98,
      modalidad: "Híbrido",
      estado: "Aprobado",
      foto: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
      descripcion: "Domina las herramientas de SEO, SEM y redes sociales.",
      modulos: [
        "Módulo 1: Google Ads",
        "Módulo 2: Meta Business Suite",
        "Módulo 3: Analítica de Conversión",
      ],
    },
  ];
  if (!datos) {
    localStorage.setItem("ueb_cursos", JSON.stringify(predeterminados));
    return predeterminados;
  }
  return JSON.parse(datos);
}

function guardarCursosGlobales(lista) {
  localStorage.setItem("ueb_cursos", JSON.stringify(lista));
}

let editandoId = null;
let cursoEnRevisionId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderizarTablaAdmin();
});

function renderizarTablaAdmin() {
  const tbody = document.getElementById("tabla-cursos");
  if (!tbody) return;
  tbody.innerHTML = "";

  const cursos = obtenerCursosGlobales();

  cursos.forEach((curso) => {
    let tagClass = "tag-blue";
    if (curso.categoria === "Marketing") tagClass = "tag-orange";
    if (curso.categoria === "Administración") tagClass = "tag-green";

    let estadoBadge = `<strong>${curso.matriculados}</strong> / ${curso.cupos}`;
    let accionesBotones = `<button class="btn-outline btn-sm" style="margin-right: 5px;" onclick="cargarDatosEdicion(${curso.id})">✏️ Editar</button>`;

    // Si es una propuesta del docente, forzar botón de inspección/revisión
    if (curso.estado === "Pendiente") {
      estadoBadge = `<span class="tag tag-orange">Por Aprobar</span>`;
      accionesBotones = `<button class="btn-cta btn-sm" style="margin-right: 5px; background:#2b6cb0;" onclick="revisarCurso(${curso.id})">🔎 Revisar</button>`;
    }

    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #edf2f7";
    tr.innerHTML = `
            <td style="padding: 15px;"><strong>${curso.nombre}</strong><br><small class="text-muted">${curso.horas} horas · ${curso.modalidad}</small></td>
            <td style="padding: 15px;"><span class="tag ${tagClass}">${curso.categoria}</span></td>
            <td style="padding: 15px;">${curso.docente}</td>
            <td style="padding: 15px;">${estadoBadge}</td>
            <td style="padding: 15px; text-align: center;">${accionesBotones}<button class="btn-outline btn-sm text-red" style="border-color: #fc8181;" onclick="eliminarCursoAdmin(${curso.id})">🗑️</button></td>
        `;
    tbody.appendChild(tr);
  });
}

// --- NUEVO: CARGAR Y DESPLEGAR MODAL DE AUDITORÍA ---
function revisarCurso(id) {
  cursoEnRevisionId = id;
  const database = obtenerCursosGlobales();
  const curso = database.find((c) => c.id === id);
  if (!curso) return;

  document.getElementById("rev-nombre").innerText = curso.nombre;
  document.getElementById("rev-docente").innerText = curso.docente;
  document.getElementById("rev-tiempo").innerText =
    `${curso.duracionValor || "2"} ${curso.duracionTipo || "Semanas"}`;
  document.getElementById("rev-horas").innerText = curso.horas;
  document.getElementById("rev-cronograma").innerText =
    curso.cronograma || "No especificado";
  document.getElementById("rev-descripcion").innerText =
    curso.descripcion || "Sin descripción provista por el facilitador.";

  // Cargar Lista de Módulos Dinámicos
  const ul = document.getElementById("rev-modulos");
  ul.innerHTML = "";
  const listaModulos = curso.modulos || ["Módulo 1: Inducción General"];
  listaModulos.forEach((mod) => {
    const li = document.createElement("li");
    li.innerText = mod;
    ul.appendChild(li);
  });

  // Enlaces de videos y materiales
  document.getElementById("rev-video").href = curso.video || "#";
  document.getElementById("rev-material").href = curso.material || "#";

  // Vincular acción de aprobación interna
  document.getElementById("rev-btn-aprobar").onclick = () => {
    aprobarCursoDocente(id);
    cerrarModalRevision();
  };

  document.getElementById("modal-revision").classList.add("active");
}

function cerrarModalRevision() {
  document.getElementById("modal-revision").classList.remove("active");
}

function aprobarCursoDocente(id) {
  let database = obtenerCursosGlobales();
  const curso = database.find((c) => c.id === id);
  if (curso) {
    curso.estado = "Aprobado";
    guardarCursosGlobales(database);
    renderizarTablaAdmin();
    mostrarToast(`✅ Curso "${curso.nombre}" aprobado y publicado con éxito.`);
  }
}

function guardarCurso(event) {
  event.preventDefault();
  const nombre = document.getElementById("curso-nombre").value.trim();
  const categoria = document.getElementById("curso-categoria").value;
  const horas = parseInt(document.getElementById("curso-horas").value);
  const docente = document.getElementById("curso-docente").value.trim();
  const cupos = parseInt(document.getElementById("curso-cupos").value);
  const modalidad = document.getElementById("curso-modalidad").value;
  let database = obtenerCursosGlobales();

  if (editandoId !== null) {
    const curso = database.find((c) => c.id === editandoId);
    if (curso) {
      curso.nombre = nombre;
      curso.categoria = categoria;
      curso.horas = horas;
      curso.docente = docente;
      curso.cupos = cupos;
      curso.modalidad = modalidad;
      mostrarToast("📝 Registro modificado con éxito.");
    }
  } else {
    database.push({
      id: Date.now(),
      nombre,
      categoria,
      docente,
      horas,
      duracionValor: "4",
      duracionTipo: "Semanas",
      cronograma: "Por definir",
      cupos,
      matriculados: 0,
      modalidad,
      estado: "Aprobado",
      foto: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    });
    mostrarToast("🎉 Curso registrado.");
  }
  guardarCursosGlobales(database);
  cerrarModal();
  renderizarTablaAdmin();
}

function eliminarCursoAdmin(id) {
  if (confirm("¿Desea remover este curso?")) {
    let db = obtenerCursosGlobales().filter((c) => c.id !== id);
    guardarCursosGlobales(db);
    renderizarTablaAdmin();
    mostrarToast("🗑️ Registro eliminado.");
  }
}
function abrirModal() {
  editandoId = null;
  document.getElementById("form-curso").reset();
  document.getElementById("modal-titulo").innerText = "Registrar Capacitación";
  document.getElementById("modal-curso").classList.add("active");
}
function cerrarModal() {
  document.getElementById("modal-curso").classList.remove("active");
}
function cargarDatosEdicion(id) {
  const c = obtenerCursosGlobales().find((x) => x.id === id);
  if (!c) return;
  editandoId = id;
  document.getElementById("curso-nombre").value = c.nombre;
  document.getElementById("curso-categoria").value = c.categoria;
  document.getElementById("curso-horas").value = c.horas;
  document.getElementById("curso-docente").value = c.docente;
  document.getElementById("curso-cupos").value = c.cupos;
  document.getElementById("curso-modalidad").value = c.modalidad;
  document.getElementById("modal-titulo").innerText = "Modificar Capacitación";
  document.getElementById("modal-curso").classList.add("active");
}
function mostrarToast(m) {
  const t = document.getElementById("toast");
  if (t) {
    t.textContent = m;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
  }
}
document.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-curso")) cerrarModal();
  if (e.target === document.getElementById("modal-revision"))
    cerrarModalRevision();
});
