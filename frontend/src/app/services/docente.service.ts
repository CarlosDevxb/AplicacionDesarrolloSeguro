import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { Docente } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  // Asumimos que los datos del perfil se obtienen de la API de usuarios
  private usersApiUrl = 'http://localhost:3000/api/users';
  private docentesApiUrl = 'http://localhost:3000/api/docentes'; // URL base para futuras operaciones específicas de docentes

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Usamos el endpoint de perfil existente que ya devuelve los datos del usuario logueado
  getDocenteById(id: number): Observable<Docente> {
    // El ID es implícito en el token, por lo que usamos el endpoint de perfil general
    return this.http.get<Docente>(`${this.usersApiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  // Usamos el endpoint existente para solicitar el código de actualización
  requestUpdateCode(id: number, contrasena_actual: string): Observable<any> {
    // El ID del usuario se obtiene del token en el backend, no es necesario enviarlo
    return this.http.post(`${this.usersApiUrl}/request-update-code`, { contrasena_actual }, { headers: this.getAuthHeaders() });
  }

  // Endpoint para actualizar los datos del docente
  updateDocente(id: number, data: any): Observable<any> {
    // El ID del usuario se obtiene del token en el backend
    // Usamos el endpoint de perfil general para la actualización
    return this.http.put(`${this.usersApiUrl}/profile`, data, { headers: this.getAuthHeaders() });
  }
}