// frontend/src/app/pages/admin/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; color: var(--text-color);">
      <h1>Panel de Administrador</h1>
      <p>¡Bienvenido, administrador! Desde aquí podrás gestionar el sistema.</p>
    </div>
  `
})
export default class AdminDashboardComponent {}