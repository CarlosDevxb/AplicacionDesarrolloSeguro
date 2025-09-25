import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-aspirante-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class AspiranteDashboardComponent implements OnInit {
  authService = inject(AuthService);

  aspirante: any = null;
  isSidebarCollapsed = false;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.aspirante = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del aspirante', err);
        this.authService.logout();
      }
    });
  }

  logout() {
    this.authService.logout();
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
        if (this.aspirante) {
          this.aspirante.foto = response.filePath;
        }
        // Opcional: mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al subir la imagen', err);
        // Opcional: mostrar un mensaje de error
      }
    });
  }
}