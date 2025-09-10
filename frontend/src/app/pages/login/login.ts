// frontend/src/app/pages/login/login.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // <-- Importante para los formularios
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export default class LoginComponent {
  // Inyección de dependencias moderna y más limpia
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;

  // Definimos el formulario y sus validadores
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Este método se llama cuando el usuario envía el formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca todos los campos para mostrar errores
      return;
    }

    this.errorMessage = null;

    // Llamamos al servicio para hacer el login
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // Si todo sale bien, navegamos al dashboard
        alert('Login exitoso, navegando al dashboard...');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Si el backend devuelve un error, lo mostramos
        this.errorMessage = 'Credenciales incorrectas.';
        console.error('Error en el login:', err);
      }
    });
  }
}