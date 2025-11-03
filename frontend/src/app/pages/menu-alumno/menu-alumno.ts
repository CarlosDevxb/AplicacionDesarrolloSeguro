import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { SessionTimerService } from '../../services/session-timer.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-menu-alumno',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './menu-alumno.html',
  styleUrls: ['./menu-alumno.css']
})
export default class MenuAlumnoComponent implements OnInit {
  private authService = inject(AuthService);
  private sessionTimerService = inject(SessionTimerService);
  private titleService = inject(Title);

  // Estado de la UI
  isSidebarCollapsed = false;
  alumno: any = null;

  ngOnInit(): void {
    this.titleService.setTitle('Mi Perfil - CHAFATEC');
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.sessionTimerService.startTimers(); // ¡Iniciamos los timers aquí!
        this.alumno = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del alumno', err);
        this.authService.logout(); // Si falla, lo mejor es cerrar sesión
      }
    });
  }

  // Métodos para controlar la UI
  toggleSidebar(event?: MouseEvent) {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  // Helper para obtener el prefijo y el texto del estatus
  getStatusInfo(status: string): { prefix: string; text: string; icon: string; class: string } {
    const lowerStatus = status?.toLowerCase() || 'desconocido';

    switch (lowerStatus) {
      case 'activo':
        return { prefix: 'ACT', text: 'Activo', icon: 'fa-check-circle', class: 'activo' };
      case 'inactivo':
        return { prefix: 'BAJ', text: 'Inactivo', icon: 'fa-times-circle', class: 'inactivo' };
      case 'baja temporal':
        return { prefix: 'BAJ', text: 'Baja Temporal', icon: 'fa-pause-circle', class: 'baja-temporal' };
      case 'activo con especiales':
        return { prefix: 'AEE', text: 'Con Especiales', icon: 'fa-exclamation-triangle', class: 'con-especiales' };
      case 'egresado':
        return { prefix: 'EEG', text: 'Egresado', icon: 'fa-graduation-cap', class: 'egresado' };
      default:
        return { prefix: 'N/A', text: status || 'No definido', icon: 'fa-question-circle', class: 'desconocido' };
    }
  }
}
