import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Docente } from '../../../../models/docente.model';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-docente-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">
      <!-- Cabecera de Bienvenida -->
      <header class="content-header">
        <div class="header-text">
          <h1>Bienvenido de nuevo, {{ docente?.nombre_completo || 'Docente' }}</h1>
          <p>Aquí tienes un resumen de tu actividad y notificaciones.</p>
        </div>
      </header>

      <!-- Sección de Tarjetas de Resumen -->
      <section class="summary-cards">
        <!-- Las tarjetas que ya tenías -->
        <div class="card"><div class="card-icon" style="background-color: #e0f2fe;"><i class="fas fa-book-open" style="color: #0ea5e9;"></i></div><h3>Mis Cursos</h3><p>Gestiona tus materias y contenido.</p></div>
        <div class="card"><div class="card-icon" style="background-color: #e0fdf4;"><i class="fas fa-users" style="color: #10b981;"></i></div><h3>Estudiantes</h3><p>Consulta la lista de tus alumnos.</p></div>
        <div class="card"><div class="card-icon" style="background-color: #fef3c7;"><i class="fas fa-clipboard-list" style="color: #f59e0b;"></i></div><h3>Tareas</h3><p>Revisa y califica las entregas.</p></div>
      </section>

      <section class="content-area">
        <div class="notice-board">
          <h2>Cartelera de Avisos</h2>
          <p>Aquí se mostrarán los avisos importantes de la institución.</p>
        </div>
      </section>
    </div>
  `,
  // Reutilizamos los estilos del dashboard principal
  styleUrls: ['../dashboard/dashboard.css']
})
export class DocenteInicioComponent implements OnInit {
  docente: Docente | null = null;
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.docente = data;
    });
  }
}