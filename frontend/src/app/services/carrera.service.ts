import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/carreras';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCarreras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCarrera(carrera: any): Observable<any> {
    return this.http.post(this.apiUrl, carrera, { headers: this.getHeaders() });
  }

  updateCarrera(id: number, carrera: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carrera, { headers: this.getHeaders() });
  }
}