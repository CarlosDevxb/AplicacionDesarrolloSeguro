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
        // Al hacer login, guardamos el token en localStorage
        localStorage.setItem('token', response.token);
      })
    );
    
  }

  aspiranteLogin(credentials: any): Observable<any> {
    // Llama al endpoint específico para el login de aspirantes
    return this.http.post(`${this.authApiUrl}/aspirante-login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
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
        // Al refrescar, también actualizamos el token
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(options: { sessionExpired?: boolean; redirectPath?: string } = {}): void {
    // 1. Obtenemos el rol ANTES de borrar el token.
    const userRole = this.getUserRole();

    // 2. Borramos el token del almacenamiento local.
    localStorage.removeItem('token');

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
    return localStorage.getItem('token');
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

  changePassword(passwordData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.usersApiUrl}/profile/password`, passwordData, { headers });
  }

  // ¡NUEVO MÉTODO!
  resetPassword(token: string, password: string): Observable<any> {
    // No se necesita token de autenticación, el token de reseteo va en la URL
    return this.http.post(`${this.authApiUrl}/reset-password/${token}`, { password });
  }
  // ¡NUEVO MÉTODO!
  establecerContrasena(token: string, password: string): Observable<any> {
    return this.http.post(`${this.usersApiUrl}/auth/establecer-contrasena`, { token, password });
  }
  

  
  
}
