import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

// Helper para decodificar el token. Lo traemos aquí para usarlo localmente.
const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
})
export default class NotFoundComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Redirige al usuario a su dashboard si tiene una sesión activa,
   * o al login si no la tiene.
   */
  goHome(): void {
    const token = this.authService.getToken();

    if (token) {
      const decodedToken = decodeToken(token);
      const userRole = decodedToken?.rol;

      // Redirigimos según el rol encontrado en el token
      switch (userRole) {
        case 'alumno':
          this.router.navigate(['/alumno/dashboard']);
          break;
        case 'docente':
          this.router.navigate(['/docente/dashboard']);
          break;
        case 'administrativo':
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/login']); // Si el rol es desconocido, al login
      }
    } else {
      // Si no hay token, al login
      this.router.navigate(['/login']);
    }
  }
}