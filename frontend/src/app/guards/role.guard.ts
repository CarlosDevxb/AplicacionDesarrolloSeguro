import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Obtenemos el rol esperado desde la configuración de la ruta
  const expectedRole = route.data['expectedRole'];

  // 2. Verificamos si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']); // Si no, lo mandamos al login
    return false;
  }

  // 3. Obtenemos el rol del usuario actual desde el token
  const currentUserRole = authService.getUserRole();

  // 4. Comparamos el rol del usuario con el rol esperado
  if (currentUserRole !== expectedRole) {
    // Si no coinciden, lo redirigimos a su propio dashboard (o al login si algo falla)
    const userDashboard = currentUserRole ? `/${currentUserRole}/dashboard` : '/login';
    router.navigate([userDashboard]);
    return false;
  }

  // 5. Si todo está en orden, permitimos el acceso
  return true;
};