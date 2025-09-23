// frontend/src/app/pages/alumno/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumno-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; color: var(--text-color);">
      <h1>Portal del Alumno</h1>
      <p>¡Bienvenido! Consulta tus calificaciones, horarios y más.</p>
    </div>
  `
})
export default class AlumnoDashboardComponent {}