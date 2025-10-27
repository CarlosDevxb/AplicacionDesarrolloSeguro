/* ===== Datos demo por tarea (fechas ajustadas a hoy: 2025-10-23) ===== */
const TAREAS = {
  algoritmos: {
    id: "algoritmos",
    icon: "fa-diagram-project",
    titulo: "Algoritmos — Cola y Pila",
    materia: "Estructura de Datos (ED-204) · M. Gómez",
    prioridad: "Alta",
    asignada: "2025-10-15",
    limite: "2025-10-20",              // ya venció
    estado: "Pendiente",
    entregado: false,                  // NUEVO: flag de entrega
    instrucciones: [
      "Implementa **Pila** y **Cola** (push/pop, enqueue/dequeue, peek, isEmpty, size).",
      "Cubre casos borde (underflow/overflow lógicos).",
      "Entrega un README con instrucciones de ejecución y pruebas.",
      "Lenguaje sugerido: C++ o Java (libre)."
    ],
    recursos: [
      { label: "Guía de estructuras lineales (PDF)", href: "#" },
      { label: "Repositorio base (ZIP)", href: "#" },
      { label: "Ejemplos de pruebas unitarias", href: "#" }
    ],
    rubrica: [
      { criterio: "Estructura de datos", desc: "Implementación correcta de pila y cola", pts: 40 },
      { criterio: "Pruebas", desc: "Cobertura de casos y resultados", pts: 30 },
      { criterio: "Calidad", desc: "Legibilidad, documentación y estilo", pts: 20 },
      { criterio: "Entrega", desc: "README + empaquetado correcto", pts: 10 },
    ],
    comentarios: [
      { by:"Profesor", at:"2025-10-15 10:15", text:"Recuerden validar underflow/overflow." }
    ],
    timeline: [
      { icon:"fa-flag", text:"Tarea publicada", at:"2025-10-15 10:00" }
    ]
  },

  reporte3: {
    id: "reporte3",
    icon: "fa-network-wired",
    titulo: "Reporte de Práctica 3 — Wireshark",
    materia: "Redes (RC-312) · L. Ortiz",
    prioridad: "Media",
    asignada: "2025-10-18",
    limite: "2025-10-25",              // futura
    estado: "Pendiente",
    entregado: false,
    instrucciones: [
      "Capturar tráfico HTTP/HTTPS con Wireshark.",
      "Analizar handshake TLS y cabeceras HTTP.",
      "Entregar un PDF con capturas y explicación."
    ],
    recursos: [
      { label: "Plantilla de reporte (DOCX)", href: "#" },
      { label: "Guía rápida Wireshark", href: "#" }
    ],
    rubrica: [
      { criterio: "Capturas", desc:"Calidad y relevancia", pts:30 },
      { criterio: "Análisis", desc:"Explicación técnica", pts:50 },
      { criterio: "Presentación", desc:"Claridad del documento", pts:20 },
    ],
    comentarios: [],
    timeline: [
      { icon:"fa-flag", text:"Tarea publicada", at:"2025-10-18 09:00" }
    ]
  },

  ensayo: {
    id: "ensayo",
    icon: "fa-scale-balanced",
    titulo: "Ensayo: Privacidad y tecnología",
    materia: "Ética Profesional (EP-110) · A. Salazar",
    prioridad: "Baja",
    asignada: "2025-10-20",
    limite: "2025-10-23",              // hoy: vence a las 23:59
    estado: "Pendiente",
    entregado: false,
    instrucciones: [
      "Ensayo de 1 a 2 cuartillas.",
      "Perspectivas éticas y casos reales.",
      "Citar al menos 2 fuentes."
    ],
    recursos: [{ label:"Guía de citación", href:"#"}],
    rubrica: [
      { criterio:"Contenido", desc:"Profundidad y argumentos", pts:60 },
      { criterio:"Fuentes", desc:"Calidad de referencias", pts:20 },
      { criterio:"Estilo", desc:"Claridad y ortografía", pts:20 },
    ],
    comentarios: [],
    timeline: [{ icon:"fa-flag", text:"Tarea publicada", at:"2025-10-20 11:20" }]
  },

  parcial: {
    id: "parcial",
    icon: "fa-laptop-code",
    titulo: "Proyecto Parcial — SPA con API REST",
    materia: "Desarrollo Web (DW-220) · C. Ruiz",
    prioridad: "Alta",
    asignada: "2025-10-21",
    limite: "2025-10-27",              // futura
    estado: "Pendiente",
    entregado: false,
    instrucciones: [
      "Construye una SPA con enrutamiento (vanilla, React o Vue).",
      "Consumir una API pública (GET/POST).",
      "Deploy (Netlify/Vercel) y enlazar repo."
    ],
    recursos: [
      { label:"APIs públicas", href:"#"},
      { label:"Checklist de accesibilidad", href:"#" }
    ],
    rubrica: [
      { criterio:"Funcionalidad", desc:"Flujos y llamadas a API", pts:50 },
      { criterio:"UI/UX", desc:"Diseño y responsividad", pts:30 },
      { criterio:"Código", desc:"Estructura y limpieza", pts:20 },
    ],
    comentarios: [],
    timeline: [{ icon:"fa-flag", text:"Tarea publicada", at:"2025-10-21 12:00" }]
  }
};

/* ===== Helpers ===== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function fmtFechaISO(iso){
  const d = new Date(iso+"T00:00:00");
  return d.toLocaleDateString('es-MX', { year:'numeric', month:'short', day:'2-digit' });
}

function esVencida(isoLimite){
  const now = new Date();
  const end = new Date(isoLimite+"T23:59:59");
  return (end - now) < 0;
}

function tiempoRestante(isoLimite){
  if (esVencida(isoLimite)) return "Se venció";
  const now = new Date();
  const end = new Date(isoLimite+"T23:59:59");
  const diff = end - now;
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  return `${d} día(s) ${h} hora(s)`;
}

function prioridadTag(p){
  const map = { "Alta":"high", "Media":"medium", "Baja":"low" };
  return `<span class="tag ${map[p]||""}">${p}</span>`;
}

/* ===== Render ===== */
function renderHead(t){
  const head = document.getElementById('tareaHead');
  head.innerHTML = `
    <div class="th-left">
      <div class="th-icon"><i class="fa-solid ${t.icon}"></i></div>
      <div>
        <h1 class="th-title">${t.titulo}</h1>
        <div class="th-course">${t.materia}</div>
      </div>
    </div>
    <div class="th-tags">
      ${prioridadTag(t.prioridad)}
      <span class="tag">Entrega: ${fmtFechaISO(t.limite)}</span>
      <span class="tag">Asignada: ${fmtFechaISO(t.asignada)}</span>
    </div>
  `;
}

function renderInstrucciones(t){
  const c = document.getElementById('tareaInstrucciones');
  c.innerHTML = t.instrucciones.map(p=>`<p>${p}</p>`).join('');
}

function renderRubrica(t){
  const tb = document.querySelector('#tablaRubrica tbody');
  let total = 0;
  tb.innerHTML = t.rubrica.map(r=>{
    total += r.pts;
    return `<tr><td>${r.criterio}</td><td>${r.desc}</td><td>${r.pts}</td></tr>`;
  }).join('');
  document.getElementById('rubricaTotal').textContent = `Total: ${total} pts`;
}

function renderRecursos(t){
  const ul = document.getElementById('recursosList');
  ul.innerHTML = t.recursos.map(r=>`
    <li><a href="${r.href}"><i class="fa-regular fa-file"></i> ${r.label}</a></li>
  `).join('');
}

function estadoCalculado(t){
  if (t.entregado) return "Entregada";
  if (esVencida(t.limite)) return "Vencida";
  return "Pendiente";
}

function renderMeta(t){
  // estado dinámico segun fecha y entrega
  const est = estadoCalculado(t);

  document.getElementById('fAsignada').textContent = fmtFechaISO(t.asignada);
  document.getElementById('fLimite').textContent  = fmtFechaISO(t.limite);
  document.getElementById('fRestante').textContent= tiempoRestante(t.limite);

  // prioridad como tag
  const fPri = document.getElementById('fPrioridad');
  if (fPri){
    fPri.outerHTML  = prioridadTag(t.prioridad);
  }

  const fEst = document.getElementById('fEstado');
  if (fEst){
    fEst.textContent = est;  // muestra: Pendiente / Vencida / Entregada
  }

  const fEnt = document.getElementById('fEntregado'); // opcional en tu HTML
  if (fEnt){
    fEnt.textContent = t.entregado ? "Sí" : "No";
  }
}

function renderComentarios(t){
  const box = document.getElementById('comentariosList');
  box.innerHTML = t.comentarios.map(c=>`
    <div class="comentario">
      <div class="by">${c.by}</div>
      <div class="at">${c.at}</div>
      <div class="tx">${c.text}</div>
    </div>
  `).join('') || `<div class="muted">No hay comentarios aún.</div>`;
}

function renderTimeline(t){
  const ul = document.getElementById('timeline');
  ul.innerHTML = t.timeline.map(i=>`
    <li><i class="fa-solid ${i.icon}"></i> <div>${i.text}<div class="muted">${i.at}</div></div></li>
  `).join('');
}

/* ===== Interacciones ===== */
function setupActions(t){
  // Marcar como hecho (marca como entregada aunque no subas archivo, demo)
  document.getElementById('btnMarcarHecho').addEventListener('click', ()=>{
    t.entregado = true;
    t.timeline.unshift({ icon:"fa-square-check", text:"Marcada como hecha", at: new Date().toLocaleString('es-MX') });
    renderMeta(t);
    renderTimeline(t);
  });

  // Comentarios (demo)
  document.getElementById('btnComentar').addEventListener('click', ()=>{
    const inp = document.getElementById('nuevoComentario');
    const val = inp.value.trim();
    if(!val) return;
    t.comentarios.push({ by:"Tú", at:new Date().toLocaleString('es-MX'), text:val });
    inp.value = "";
    renderComentarios(t);
  });

  // Entrega (demo)
  document.getElementById('btnEntregar').addEventListener('click', ()=>{
    const url = document.getElementById('urlEntrega').value.trim();
    const files = document.getElementById('fileInput').files;
    let msg = "";
    if (files && files.length) msg += `${files.length} archivo(s) seleccionado(s). `;
    if (url) msg += `URL recibida.`;
    if (!msg) msg = "Sin archivos ni URL.";

    // marca como entregado
    t.entregado = true;

    document.getElementById('entregaStatus').textContent = `Entrega registrada: ${msg}`;
    t.timeline.unshift({ icon:"fa-paper-plane", text:"Entrega enviada", at:new Date().toLocaleString('es-MX') });

    renderMeta(t);
    renderTimeline(t);
  });
}

/* ===== Init ===== */
(function init(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'algoritmos';
  const t = TAREAS[id];

  if(!t){
    document.querySelector('.tarea-page').innerHTML = `
      <h1>No se encontró la tarea</h1>
      <p class="muted">Verifica el enlace.</p>
      <p><a class="btn" href="Index.html">Volver al inicio</a></p>
    `;
    return;
  }

  renderHead(t);
  renderInstrucciones(t);
  renderRubrica(t);
  renderRecursos(t);
  renderMeta(t);
  renderComentarios(t);
  renderTimeline(t);
  setupActions(t);
})();
