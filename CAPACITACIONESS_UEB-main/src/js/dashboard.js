// =================================================================
// LÓGICA DINÁMICA DE ENRUTAMIENTO Y MATRÍCULAS (STUDENT DASHBOARD)
// =================================================================

function obtenerCursosGlobales() {
  return JSON.parse(localStorage.getItem("ueb_cursos")) || [];
}

function obtenerMatriculasEstudiante() {
  return JSON.parse(localStorage.getItem("ueb_matriculas")) || [];
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarDashboardEstudiante();
});

function renderizarDashboardEstudiante() {
  const contenedor = document.getElementById("contenedor-dashboard-estudiante");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const cursosAll = obtenerCursosGlobales();
  const matriculas = obtenerMatriculasEstudiante();

  // 1. Renderizar el curso base obligatorio ("Desarrollo de Microservicios")
  contenedor.innerHTML += `
        <div class="horizontal-card">
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80" alt="Software">
            <div class="card-body">
                <span class="tag tag-blue">Software</span>
                <h4>Desarrollo de Microservicios</h4>
                <div class="progress-container">
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:75%;"></div></div>
                    <span class="text-sm font-bold blue-text">75%</span>
                </div>
            </div>
            <div class="card-actions">
                <a href="aula.html"><button class="btn-cta btn-sm">Continuar →</button></a>
            </div>
        </div>
    `;

  let totalContador = 1;

  // 2. Buscar e Inyectar los cursos nuevos del catálogo guardados en el LocalStorage
  matriculas.forEach((nombreCurso) => {
    const cursoInfo = cursosAll.find((c) => c.nombre === nombreCurso);
    if (cursoInfo) {
      let tagClass = "tag-blue";
      if (cursoInfo.categoria === "Marketing") tagClass = "tag-orange";
      if (cursoInfo.categoria === "Administración") tagClass = "tag-green";

      const card = document.createElement("div");
      card.className = "horizontal-card";
      card.innerHTML = `
                <img src="${cursoInfo.foto}" alt="Curso">
                <div class="card-body">
                    <span class="tag ${tagClass}">${cursoInfo.categoria}</span>
                    <h4>${cursoInfo.nombre}</h4>
                    <div class="progress-container">
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:0%; background:var(--orange-cta);"></div></div>
                        <span class="text-sm font-bold orange-text">0%</span>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="aula.html"><button class="btn-cta btn-sm">Iniciar Curso →</button></a>
                </div>
            `;
      contenedor.appendChild(card);
      totalContador++;
    }
  });

  // Actualizar los marcadores numéricos superiores
  const h3Cursos = document.getElementById("dash-total-cursos");
  if (h3Cursos) h3Cursos.textContent = `0${totalContador}`;

  const badgeNotif = document.getElementById("dash-badge-notif");
  if (badgeNotif) badgeNotif.textContent = totalContador;
}
