import { Component } from '@angular/core';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  template: `<h1>Bienvenido al Dashboard de Docente</h1>`
})
export default class DocenteDashboardComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  logout() {
    // Lógica de cierre de sesión
  }
}