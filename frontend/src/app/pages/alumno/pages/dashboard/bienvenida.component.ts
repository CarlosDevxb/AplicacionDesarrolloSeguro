import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-bienvenida-alumno',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="content-header" *ngIf="alumno">
      <h1>Hola, {{ alumno.nombre_completo }}</h1>
    </header>
  `,
  styleUrls: ['../menu-alumno/menu-alumno.css'] // Reutilizamos los estilos
})
export class BienvenidaAlumnoComponent implements OnInit {
  private authService = inject(AuthService);
  alumno: any = null;

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => this.alumno = data);
  }
}