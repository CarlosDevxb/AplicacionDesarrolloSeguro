import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class DocenteDashboardComponent implements OnInit {
  authService = inject(AuthService);

  isSidebarCollapsed = false;
  docente: any = null; // Para almacenar los datos del docente

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.docente = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del docente', err);
        // Opcional: si falla, podríamos redirigir al login
        this.authService.logout();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  // Función para obtener el primer nombre y primer apellido
  getShortName(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts[1] : '';
    return `${firstName} ${lastName}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadProfilePicture(file);
    }
  }

  private uploadProfilePicture(file: File): void {
    this.authService.uploadProfilePicture(file).subscribe({
      next: (response) => {
        // Actualizamos la foto en el objeto local para que se refleje en la UI al instante
        if (this.docente) {
          this.docente.foto = response.filePath;
        }
      },
      error: (err) => {
        console.error('Error al subir la imagen', err);
      }
    });
  }
}
