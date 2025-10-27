/* ===========================
   Portal Alumno — INICIO (script.js)
   =========================== */

/* === Saludo dinámico === */
(function(){
  const fullName = document.querySelector('.profile-name')?.textContent?.trim() || 'Alumno';
  const firstName = fullName.split(/\s+/)[0];
  const greet = document.getElementById('greeting');
  if (greet) greet.textContent = `Bienvenido, ${firstName}`;
})();

/* === Datos demo === */
const TASKS = [
  { id:"algoritmos", titulo:"Algoritmos", materia:"Estructura de Datos",
    desc:"Implementar cola y pila con operaciones básicas y pruebas.",
    fecha:"2025-10-20", fechaLabel:"20 Oct", icon:"fa-diagram-project", prioridad:"Alta" },
  { id:"reporte3", titulo:"Reporte Práctica 3", materia:"Redes",
    desc:"Capturas de Wireshark y análisis de tráfico HTTP/HTTPS.",
    fecha:"2025-10-22", fechaLabel:"22 Oct", icon:"fa-network-wired", prioridad:"Media" },
  { id:"ensayo", titulo:"Ensayo corto", materia:"Ética Profesional",
    desc:"Reflexión de 1 a 2 cuartillas sobre privacidad y tecnología.",
    fecha:"2025-10-24", fechaLabel:"24 Oct", icon:"fa-scale-balanced", prioridad:"Baja" },
  { id:"parcial", titulo:"Proyecto Parcial", materia:"Desarrollo Web",
    desc:"Construir SPA con enrutamiento y consumo de API REST.",
    fecha:"2025-10-27", fechaLabel:"27 Oct", icon:"fa-laptop-code", prioridad:"Alta" },
];

/* === Render tareas (tarot) — con enlace a tarea.html === */
function renderTasks(){
  const track = document.getElementById('tasksTrack');
  if (!track) return;
  track.innerHTML = TASKS.map(t => `
    <article class="tarot-card">
      <header>
        <div class="tarot-glyph"><i class="fa-solid ${t.icon}"></i></div>
        <div class="tarot-title">${t.titulo}</div>
        <div class="tarot-course">${t.materia}</div>
      </header>
      <div class="tarot-desc">${t.desc}</div>
      <footer>
        <div class="tarot-meta">
          <span><i class="fa-regular fa-calendar"></i> ${t.fechaLabel}</span>
          <span><i class="fa-solid fa-fire-flame-curved"></i> ${t.prioridad}</span>
        </div>
        <div class="tarot-cta">
          <a class="btn" href="tarea.html?id=${encodeURIComponent(t.id)}">Ver detalles</a>
        </div>
      </footer>
    </article>
  `).join('');
}

/* === Anuncios (demo) === */
const ANNOUNCEMENTS = [
  { titulo:"Semana de Innovación", fecha:"15 Oct",
    texto:"Conferencias y talleres en el auditorio principal. Regístrate en el portal.",
    tag:"Eventos" },
  { titulo:"Nuevo Reglamento de Laboratorios", fecha:"18 Oct",
    texto:"Uso obligatorio de bata y credencial. Consulta el documento actualizado.",
    tag:"Académico" },
  { titulo:"Becas de Manutención", fecha:"19 Oct",
    texto:"Se abre convocatoria. Revisa requisitos y fechas límite en Servicios Escolares.",
    tag:"Becas" },
  { titulo:"Mantenimiento de Plataforma", fecha:"21 Oct",
    texto:"El portal estará en mantenimiento de 2:00 a 4:00 a.m.",
    tag:"Sistemas" },
  { titulo:"Jornada de Puertas Abiertas", fecha:"23 Oct",
    texto:"Recorridos guiados por laboratorios y charlas con docentes.",
    tag:"Eventos" },
];

/* === Render anuncios con filtro === */
function renderAnnouncements(filterTag = 'Todos'){
  const list = document.getElementById('annList');
  if (!list) return;

  const items = filterTag === 'Todos'
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(a => a.tag === filterTag);

  if (items.length === 0){
    list.innerHTML = `
      <article class="announce-card">
        <div class="announce-head">
          <h3 class="announce-title">No hay anuncios en “${filterTag}”</h3>
          <span class="announce-date"></span>
        </div>
        <p class="announce-body">Vuelve a revisar más tarde o selecciona otra pestaña.</p>
      </article>
    `;
    return;
  }

  list.innerHTML = items.map(a => `
    <article class="announce-card">
      <div class="announce-head">
        <h3 class="announce-title">${a.titulo}</h3>
        <span class="announce-date"><i class="fa-regular fa-calendar"></i> ${a.fecha}</span>
      </div>
      <p class="announce-body">${a.texto}</p>
      <span class="announce-tag">${a.tag}</span>
    </article>
  `).join('');
}

/* === Carrusel de tareas === */
function setupCarousel(){
  const track = document.getElementById('tasksTrack');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  if (!track || !btnPrev || !btnNext) return;

  const step = () => {
    const card = track.querySelector('.tarot-card');
    return card ? (card.getBoundingClientRect().width + 16) : 300;
  };

  btnPrev.addEventListener('click', ()=> track.scrollBy({left: -step(), behavior:'smooth'}));
  btnNext.addEventListener('click', ()=> track.scrollBy({left:  step(), behavior:'smooth'}));
}

/* === Tabs de anuncios === */
function setupAnnTabs(){
  const tabs = document.querySelectorAll('.ann-tab');
  let current = 'Todos';

  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      const tag = tab.dataset.tag || 'Todos';
      if (tag === current) return;

      tabs.forEach(t=>{
        t.classList.remove('is-active');
        t.setAttribute('aria-selected','false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');

      current = tag;
      renderAnnouncements(current);
    });
  });
}

/* === Logout feedback sutil === */
function setupLogoutEffect(){
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', ()=>{
    logoutBtn.classList.add('is-marked');
    setTimeout(()=> logoutBtn.classList.remove('is-marked'), 1200);
  });
}

/* === Marcar menú activo por URL (sin hashes) === */
function markActiveMenu() {
  const path = location.pathname.split('/').pop().toLowerCase() || 'index.html';
  document.querySelectorAll('.menu .menu-item').forEach(a => {
    // obtener solo el archivo del href
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    a.classList.toggle('active', href === path);
  });
}

/* === Init === */
function initInicio(){
  renderTasks();
  renderAnnouncements('Todos');
  setupCarousel();
  setupAnnTabs();
  setupLogoutEffect();
  markActiveMenu();
}

/* === Arranque === */
window.addEventListener('DOMContentLoaded', initInicio);
window.addEventListener('popstate', markActiveMenu);
