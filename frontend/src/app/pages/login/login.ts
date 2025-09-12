// frontend/src/app/pages/login/login.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

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
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;
  // Esta es la variable clave que controla el mensaje en el HTML
  userNotFound = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    // Reiniciamos las variables antes de cada intento
    this.errorMessage = null;
    this.userNotFound = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        // Esta es la lógica crucial
        if (err.status === 404) {
          // Si el error es 404, activamos la variable para la vista
          this.userNotFound = true;
        } else {
          // Para cualquier otro error, mostramos el mensaje de error general
          this.errorMessage = 'La contraseña es incorrecta.';
        }
        // Este console.log es la prueba de que este bloque se está ejecutando
        console.error('Error en el login:', err);
      }
    });
  }
}