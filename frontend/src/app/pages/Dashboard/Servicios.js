// Ejecuta SOLO si esta sección existe (sirve para SPA o vista suelta)
(function initServicios(){
  const page = document.getElementById('page-servicios');
  if (!page) return;

  // ===== Saludo dinámico =====
  (function(){
    const fullName = document.querySelector('.profile-name')?.textContent?.trim() || 'Alumno';
    const firstName = fullName.split(/\s+/)[0];
    const greet = document.getElementById('greeting');
    if (greet) greet.textContent = `Bienvenido, ${firstName}`;
  })();

  // ===== Datos DEMO =====
  const PAGOS = [
    { concepto:'Inscripción Agosto-Diciembre', ref:'A1B2C3D4', importe:'$1,500.00', vence:'25 Oct 2025', estado:'Pendiente' },
    { concepto:'Credencial',                    ref:'X9Y8Z7W6', importe:'$120.00',   vence:'30 Oct 2025', estado:'Pagado'    },
  ];
  const CONSTANCIAS = [
    { tipo:'Estudios',   folio:'CE-10294', fecha:'12 Oct 2025', estado:'Entregada'  },
    { tipo:'No adeudo',  folio:'NA-88311', fecha:'15 Oct 2025', estado:'En proceso' },
  ];

  function renderPagos(){
    const tb = document.getElementById('tbodyPagos');
    if(!tb) return;
    tb.innerHTML = PAGOS.map(p => `
      <tr>
        <td>${p.concepto}</td>
        <td>${p.ref}</td>
        <td>${p.importe}</td>
        <td>${p.vence}</td>
        <td>
          <span class="status ${
            p.estado === 'Pagado' ? 'ok' :
            p.estado === 'Pendiente' ? 'warn' : 'danger'
          }">${p.estado}</span>
        </td>
      </tr>
    `).join('');
  }

  function renderConstancias(){
    const tb = document.getElementById('tbodyConstancias');
    if(!tb) return;
    tb.innerHTML = CONSTANCIAS.map(c => `
      <tr>
        <td>${c.tipo}</td>
        <td>${c.folio}</td>
        <td>${c.fecha}</td>
        <td>
          <span class="status ${
            c.estado === 'Entregada' ? 'ok' :
            c.estado === 'En proceso' ? 'warn' : 'danger'
          }">${c.estado}</span>
        </td>
      </tr>
    `).join('');
  }

  // ===== Acciones =====
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;

    const actions = {
      'ver-pagos': () => {
        const panel = document.getElementById('panelPagos');
        if (panel){
          panel.style.display = 'block';
          renderPagos();
          window.scrollTo({ top: panel.offsetTop - 12, behavior: 'smooth' });
        }
      },
      'generar-referencia': () => alert('Generar referencia (demo).'),
      'solicitar-constancia': () => {
        const panel = document.getElementById('panelConstancias');
        if (panel){
          alert('Solicitud de constancia (demo).');
          panel.style.display = 'block';
          renderConstancias();
        }
      },
      'mis-constancias': () => {
        const panel = document.getElementById('panelConstancias');
        if (panel){
          panel.style.display = 'block';
          renderConstancias();
          window.scrollTo({ top: panel.offsetTop - 12, behavior: 'smooth' });
        }
      },
    };

    const fn = actions[el.dataset.action];
    if (fn) fn();
  });
})();
