// frontend/src/app/pages/login/login.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <-- 1. Importa RouterLink
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importa esto para tipar el error

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // <-- 2. Añádelo a los imports
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;
  userNotFound = false; // <-- 3. Nueva propiedad para controlar el mensaje

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Reseteamos los mensajes de error al iniciar un nuevo intento
    this.errorMessage = null;
    this.userNotFound = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      // 4. Lógica de error mejorada
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // Si el servidor responde con 404 (Not Found), el usuario no existe.
          this.userNotFound = true;
        } else {
          // Para cualquier otro error (como 401), es una credencial incorrecta.
          this.errorMessage = 'La contraseña es incorrecta.';
        }
        console.error('Error en el login:', err);
      }
    });
  }
}