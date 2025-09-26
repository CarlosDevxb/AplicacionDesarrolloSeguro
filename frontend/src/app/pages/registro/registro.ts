// frontend/src/app/pages/registro/registro.ts
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AspiranteService } from '../../services/aspirante.service';
import { Carrera } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export default class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private aspiranteService = inject(AspiranteService);
  private carreraService = inject(CarreraService); // Inyectamos el servicio correcto

  registerForm: FormGroup;
  errorMessage: string | null = null;
  currentTheme: 'dark' | 'light' = 'dark';
  carreras: Carrera[] = []; // Para almacenar la lista de carreras

  constructor() {
    this.registerForm = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      carrera_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Usamos el servicio correcto para cargar las carreras
    this.carreraService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras para el registro:', err)
    });
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;

    this.aspiranteService.solicitarFicha(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Solicitud enviada:', response);
        alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.errorMessage = err.error.message;
        } else if (err.status === 404) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
        }
        console.error('Error en el registro:', err);
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }
}