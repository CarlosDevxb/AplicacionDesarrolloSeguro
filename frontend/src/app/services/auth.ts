import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authApiUrl = 'http://localhost:3000/api/auth';
  private usersApiUrl = 'http://localhost:3000/api/users';

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authApiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Unificamos la clave del token a 'authToken'
        localStorage.setItem('authToken', response.token);
      })
    );
    
  }

  aspiranteLogin(credentials: any): Observable<any> {
    // Llama al endpoint específico para el login de aspirantes
    return this.http.post(`${this.authApiUrl}/aspirante-login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.authApiUrl}/refresh`, {}, { headers }).pipe(
      tap((response: any) => {
        // Al refrescar, también actualizamos el token con la clave correcta
        localStorage.setItem('authToken', response.token);
      })
    );
  }

  logout(options: { sessionExpired?: boolean; redirectPath?: string } = {}): void {
    // 1. Obtenemos el rol ANTES de borrar el token.
    const userRole = this.getUserRole();

    // 2. Borramos el token del almacenamiento local.
    localStorage.removeItem('authToken');

    // 3. Determinamos la ruta de redirección.
    let { sessionExpired = false, redirectPath } = options;

    // Si no se proveyó una ruta específica, la decidimos según el rol.
    if (!redirectPath) {
      redirectPath = userRole === 'aspirante' ? '/login/aspirante' : '/login';
    }

    // 4. Navegamos a la ruta correcta.
    if (sessionExpired) {
      this.router.navigate([redirectPath], { queryParams: { sessionExpired: true } });
    } else {
      this.router.navigate([redirectPath]);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    // Un usuario está autenticado si existe un token
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return decodeToken(token)?.rol;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    // 'sub' es el nombre estándar para el ID de usuario en un JWT
    return decodeToken(token)?.sub;
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.usersApiUrl}/profile`, { headers });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('profilePicture', file, file.name);

    return this.http.post(`${this.usersApiUrl}/profile/picture`, formData, { headers });
  }

  updateProfile(profileData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.usersApiUrl}/profile`, profileData, { headers });
  }

  /**
   * FASE 1: Solicita un código de verificación para cualquier cambio sensible.
   */
  requestUpdateCode(contrasena_actual: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.usersApiUrl}/request-update-code`, { contrasena_actual }, { headers });
  }

  /**
   * FASE 2: Cambia la contraseña usando el código de verificación.
   */
  changePassword(passwordData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // El backend ahora espera un PUT en /api/users/password
    return this.http.put(`${this.usersApiUrl}/password`, passwordData, { headers });
  }

  // ¡NUEVO MÉTODO!
  resetPassword(token: string, password: string): Observable<any> {
    // No se necesita token de autenticación, el token de reseteo va en la URL
    return this.http.post(`${this.authApiUrl}/reset-password/${token}`, { password });
  }
  // ¡NUEVO MÉTODO!
  establecerContrasena(token: string, password: string): Observable<any> {
    return this.http.post(`${this.authApiUrl}/establecer-contrasena/${token}`, { password });
  }
  
  // ¡NUEVO MÉTODO!
  validarTokenEstablecimiento(token: string): Observable<any> {
    return this.http.get(`${this.authApiUrl}/validar-token-establecimiento/${token}`);
  }
  

  
  
}
