import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu-alumno',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './menu-alumno.html',
  styleUrl: './menu-alumno.css'
})
export default class MenuAlumnoComponent implements OnInit {
  private authService = inject(AuthService);

  // Estado de la UI
  isSidebarCollapsed = false;
  alumno: any = null;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
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
}
