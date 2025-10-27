// Ejecuta SOLO si la sección existe (sirve para SPA o vista suelta)
(function initAcademico(){
  const page = document.getElementById('page-academico');
  if (!page) return;

  // ===== Saludo dinámico =====
  (function(){
    const fullName = document.querySelector('.profile-name')?.textContent?.trim() || 'Alumno';
    const firstName = fullName.split(/\s+/)[0];
    const greet = document.getElementById('greeting');
    if (greet) greet.textContent = `Bienvenido, ${firstName}`;
  })();

  // ===== Datos de ejemplo =====
  const MATERIAS = [
    { nombre:'Estructura de Datos', clave:'ED-204', docente:'M. Gómez',  avance:72, estado:'Regular'   },
    { nombre:'Redes de Computadoras', clave:'RC-312', docente:'L. Ortiz', avance:55, estado:'Regular'   },
    { nombre:'Ética Profesional',     clave:'EP-110', docente:'A. Salazar', avance:88, estado:'Excelente' },
    { nombre:'Desarrollo Web',        clave:'DW-220', docente:'C. Ruiz',   avance:41, estado:'Atención'  },
  ];

  function estadoBadge(estado){
    const map = { 'Excelente':'ok', 'Regular':'warn', 'Atención':'danger' };
    const tone = map[estado] || 'warn';
    return `<span class="badge" style="border-color:var(--${tone}); color:var(--${tone});">${estado}</span>`;
  }

  function renderMaterias(){
    const cont = document.getElementById('listaMaterias');
    if(!cont) return;
    cont.innerHTML = MATERIAS.map(m => `
      <div class="materia">
        <div class="left">
          <i class="fa-solid fa-book-bookmark" aria-hidden="true"></i>
          <div>
            <div style="font-weight:700;">${m.nombre} <span class="muted">(${m.clave})</span></div>
            <div class="muted">Docente: ${m.docente}</div>
          </div>
        </div>
        <div class="right" style="display:flex; align-items:center; gap:12px;">
          ${estadoBadge(m.estado)}
          <div class="progress" aria-label="avance ${m.avance}%" title="${m.avance}%">
            <span style="width:${m.avance}%;"></span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function setupAccordion(){
    document.querySelectorAll('.acc-head').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const targetSel = btn.getAttribute('data-target');
        const panel = document.querySelector(targetSel);
        const icon = btn.querySelector('.acc-icon');
        if(!panel) return;

        const isOpen = panel.classList.contains('open');
        // Cierra todos
        document.querySelectorAll('.acc-panel').forEach(p=>p.classList.remove('open'));
        document.querySelectorAll('.acc-icon').forEach(i=> i.style.transform = 'rotate(0deg)');
        // Abre el que toque
        if(!isOpen){
          panel.classList.add('open');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  // Acciones demo de Inscripciones
  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-action]');
    if(!el) return;
    const map = {
      'ver-info':'Aquí iría la guía de inscripción. (Demo)',
      'faq':'Abrir preguntas frecuentes. (Demo)',
      'ver-grupos':'Buscador de grupos por materia. (Demo)',
      'ver-verano':'Oferta intersemestral. (Demo)',
      'linea-tiempo':'Hitos del curso de verano. (Demo)',
      'simulador':'Simulador de carga académica. (Demo)',
      'confirmar':'Confirmación de selección de materias. (Demo)'
    };
    const msg = map[el.dataset.action];
    if (msg) alert(msg);
  });

  // Init
  renderMaterias();
  setupAccordion();
})();
