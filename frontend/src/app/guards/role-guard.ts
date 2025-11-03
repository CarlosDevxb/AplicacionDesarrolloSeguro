// frontend/src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { firstValueFrom } from 'rxjs';

// Función para decodificar el token (puedes ponerla en tu auth.service si prefieres)
const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const roleGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  let token = authService.getToken();

  // Si no hay token, no puede pasar
  if (!token) {
    authService.logout(); // Asegura que cualquier estado residual se limpie
    return false;
  }

  // Decodificamos el token para obtener el rol
  let decodedToken = decodeToken(token);

  // 1. Verificar si el token ha expirado
  const isExpired = decodedToken.exp * 1000 < Date.now();

  if (isExpired) {
    try {
      // 2. Si ha expirado, intentar refrescarlo
      const response: any = await firstValueFrom(authService.refreshToken());
      token = response.token; // Se reasigna el token

      // Verificación de seguridad: si el nuevo token es nulo, el refresco falló.
      if (!token) {
        throw new Error('El token de refresco es inválido o nulo.');
      }
      decodedToken = decodeToken(token); // Ahora es seguro decodificarlo
    } catch (error) {
      // 3. Si el refresco falla (ej. token de refresco inválido o sesión muy larga)
      // hacemos logout y redirigimos con un mensaje.
      console.error('La sesión ha expirado y no se pudo refrescar.', error);
      authService.logout({ sessionExpired: true });
      return false;
    }
  }

  // 4. Con un token válido (original o refrescado), verificamos el rol.
  const userRole = decodedToken?.rol;

  // Obtenemos el rol esperado de la definición de la ruta
  const expectedRole = route.data['expectedRole'];

  // Comparamos el rol del usuario con el rol que espera la ruta.
  // Si expectedRole es un array, comprobamos si el rol del usuario está incluido.
  const roleMatch = Array.isArray(expectedRole)
    ? expectedRole.includes(userRole)
    : userRole === expectedRole;

  if (!roleMatch) {
    // Si los roles no coinciden, lo redirigimos (por ejemplo, al login)
    authService.logout(); // Hacemos logout para evitar bucles de redirección
    return false;
  }

  // 5. Si todo está bien, puede pasar
  return true;
};