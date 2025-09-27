import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/materias';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createMateria(materiaData: any): Observable<any> {
    return this.http.post(this.apiUrl, materiaData, { headers: this.getHeaders() });
  }

  findMateriaByName(nombre: string): Observable<any> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get(`${this.apiUrl}/search`, { headers: this.getHeaders(), params });
  }
}