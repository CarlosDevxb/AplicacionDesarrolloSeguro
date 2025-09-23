import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrera } from '../models/carrera.model';

@Injectable({
  providedIn: 'root'
})
export class AspiranteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/aspirantes';

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras`);
  }

  solicitarFicha(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-ficha`, data);
  }
}