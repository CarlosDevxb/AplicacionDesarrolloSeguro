// frontend/src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Función para decodificar el token (puedes ponerla en tu auth.service si prefieres)
const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Si no hay token, no puede pasar
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Decodificamos el token para obtener el rol
  const decodedToken = decodeToken(token);
  const userRole = decodedToken?.rol;

  // Obtenemos el rol esperado de la definición de la ruta
  const expectedRole = route.data['expectedRole'];

  // Comparamos el rol del usuario con el rol que espera la ruta
  if (userRole !== expectedRole) {
    // Si los roles no coinciden, lo redirigimos (por ejemplo, al login)
    router.navigate(['/login']);
    return false;
  }

  // Si todo está bien, puede pasar
  return true;
};