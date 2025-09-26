import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TitleCasePipe, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  isSidebarCollapsed = false;
  admin: any = null;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.admin = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del administrador', err);
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
        if (this.admin) {
          this.admin.foto = response.filePath;
        }
      },
      error: (err) => console.error('Error al subir la imagen', err)
    });
  }

  isDashboardRoot(): boolean {
    return this.router.url === '/admin/dashboard';
  }
}
