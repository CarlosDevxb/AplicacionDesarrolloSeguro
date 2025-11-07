import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private adminApiUrl = 'http://localhost:3000/api/admin';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.adminApiUrl}/users`, userData, { headers: this.getAuthHeaders() });
  }

  findUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.adminApiUrl}/users/${id}`, userData, { headers: this.getAuthHeaders() });
  }
}