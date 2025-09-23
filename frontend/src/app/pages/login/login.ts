// frontend/src/app/pages/login/login.ts

import { Component, inject, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // Asegúrate de que RouterLink está importado
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export default class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private renderer = inject(Renderer2);

  errorMessage: string | null = null;
  // Esta es la variable clave que controla el mensaje en el HTML
  userNotFound = false;
  selectedRole: 'alumno' | 'personal' | 'aspirante' = 'alumno'; // Rol por defecto
  currentTheme: 'dark' | 'light' = 'dark';

  ngOnInit(): void {
    // Opcional: podrías guardar la preferencia del usuario en localStorage
    // y cargarla aquí. Por ahora, inicia en oscuro.
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }


  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Reiniciamos las variables antes de cada intento
    this.errorMessage = null;
    this.userNotFound = false;

    // Creamos el objeto de credenciales que incluye el rol seleccionado
    const credentials = {
      ...this.loginForm.value,
      rol: this.selectedRole
    };

    this.authService.login(credentials).subscribe({
       next: (response) => {
        // 1. Decodificamos el token que acabamos de recibir
        const decodedToken = decodeToken(response.token);
        const userRole = decodedToken?.rol;

        // 2. Redirigimos basándonos en los roles de TU base de datos
        if (userRole === 'alumno') {
          // Redirige al dashboard del alumno
          this.router.navigate(['/alumno/dashboard']);
        } else if (userRole === 'docente') {
          // Redirige al dashboard del docente
          this.router.navigate(['/docente/dashboard']);
        } else if (userRole === 'administrativo') {
          // Redirige al dashboard del administrativo (admin)
          this.router.navigate(['/admin/dashboard']);
        } else {
          // Si el rol no es reconocido, lo mandamos a una página por defecto
          this.router.navigate(['/login']);
        }
      },
      error: (err: HttpErrorResponse) => {
        // Esta es la lógica crucial
        if (err.status === 404) {
          // Usuario no encontrado
          this.userNotFound = true;
        } else if (err.status === 403) {
          // Rol incorrecto
          this.errorMessage = err.error.message || 'El rol seleccionado no es correcto.';
        } else {
          // Para cualquier otro error (ej. 401 Contraseña incorrecta), mostramos un mensaje general
          this.errorMessage = 'Credenciales incorrectas.';
        }
        // Este console.log es la prueba de que este bloque se está ejecutando
        console.error('Error en el login:', err);
      }
    });
  }

  selectRole(role: 'alumno' | 'personal' | 'aspirante'): void {
    this.selectedRole = role;
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }
}