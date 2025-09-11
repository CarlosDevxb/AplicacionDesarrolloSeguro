// frontend/src/app/pages/registro/registro.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; // <-- 1. Importa el servicio
import { HttpErrorResponse } from '@angular/common/http';

// ... (El validador passwordMatchValidator se queda igual) ...
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  };

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export default class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); // <-- 2. Inyecta el servicio

  registerForm: FormGroup;
  errorMessage: string | null = null; // <-- Propiedad para manejar errores

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      direccion: [''], // <-- Añadido (opcional)
      telefono: ['']   // <-- Añadido (opcional)
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;

    // 3. Llama al servicio en lugar del console.log
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        // Opcional: Muestra un mensaje de éxito
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Redirige al usuario a la página de login
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        // Maneja errores específicos del backend
        if (err.status === 409) { // 409 Conflict (email ya en uso)
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
        }
        console.error('Error en el registro:', err);
      }
    });
  }
}