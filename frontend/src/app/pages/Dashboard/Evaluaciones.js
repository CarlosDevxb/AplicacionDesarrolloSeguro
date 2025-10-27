// Ejecuta SOLO si esta sección existe (sirve para SPA o vista suelta)
(function initEvaluaciones(){
  const page = document.getElementById('page-evaluaciones');
  if (!page) return;

  // ===== Saludo dinámico =====
  (function(){
    const fullName = document.querySelector('.profile-name')?.textContent?.trim() || 'Alumno';
    const firstName = fullName.split(/\s+/)[0];
    const greet = document.getElementById('greeting');
    if (greet) greet.textContent = `Bienvenido, ${firstName}`;
  })();

  // ===== Datos DEMO =====
  const REALIZADAS = [
    { tipo:'Docente',   ref:'ED-204 — Estructura de Datos', fecha:'05 Oct 2025', estado:'Aceptada' },
    { tipo:'Servicios', ref:'Biblioteca — Atención',        fecha:'10 Oct 2025', estado:'En revisión' },
    { tipo:'Docente',   ref:'DW-220 — Desarrollo Web',      fecha:'14 Oct 2025', estado:'Aceptada' },
  ];

  function renderRealizadas(){
    const tb = document.getElementById('tbodyRealizadas');
    if(!tb) return;
    tb.innerHTML = REALIZADAS.map(r => `
      <tr>
        <td>${r.tipo}</td>
        <td>${r.ref}</td>
        <td>${r.fecha}</td>
        <td><span class="status ${r.estado === 'Aceptada' ? 'ok' : 'warn'}">${r.estado}</span></td>
      </tr>
    `).join('');
  }

  // ===== Acciones =====
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;

    const actions = {
      'ver-realizadas': () => {
        const panel = document.getElementById('panelRealizadas');
        if (panel) {
          panel.style.display = 'block';
          renderRealizadas();
          window.scrollTo({ top: panel.offsetTop - 12, behavior: 'smooth' });
        }
      },
      'descargar-comprobante': () => alert('Descargar comprobante (demo).'),
      'iniciar-docente': () => alert('Inicio de evaluación docente (demo).'),
      'ver-instrucciones': () => alert('Instrucciones para evaluar docentes (demo).'),
      'iniciar-servicios': () => alert('Inicio de evaluación de servicios (demo).'),
      'resultados-servicios': () => alert('Resultados agregados de servicios (demo).'),
    };

    const fn = actions[el.dataset.action];
    if (fn) fn();
  });
})();
