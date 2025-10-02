// frontend/src/app/services/salon.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/salones`;
  private authService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSalones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createSalon(salon: any): Observable<any> {
    return this.http.post(this.apiUrl, salon, { headers: this.getHeaders() });
  }

  updateSalon(id: number, salon: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, salon, { headers: this.getHeaders() });
  }

  deleteSalon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}