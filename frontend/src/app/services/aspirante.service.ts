import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Carrera } from '../models/carrera.model';
export interface AspiranteData {
  nombre_completo: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  carrera_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AspiranteService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/carreras`);
  }

  solicitarFicha(aspiranteData: AspiranteData): Observable<any> {
    return this.http.post(`${this.apiUrl}/aspirantes/solicitar-ficha`, aspiranteData);
  }
}