import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { TitleCasePipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';

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
  
  
  activatedRoute = inject(ActivatedRoute);

  isSidebarCollapsed = false;
  admin: any = null;
  headerTitle = 'Dashboard'; // Título por defecto
  headerSubtitle = 'Bienvenido al Panel de Administración'; // Subtítulo por defecto

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

    // Lógica para actualizar el título dinámicamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        // Devolvemos tanto el título como el subtítulo de los datos de la ruta
        return child?.snapshot.data || { title: 'Dashboard', subtitle: 'Bienvenido al Panel de Administración' };
      })
    ).subscribe((data: any) => {
      this.headerTitle = data.title;
      this.headerSubtitle = data.subtitle;
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
