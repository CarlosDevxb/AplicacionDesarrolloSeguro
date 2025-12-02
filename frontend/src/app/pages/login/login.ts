// frontend/src/app/pages/login/login.ts

import { Component, inject, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

// 1. IMPORTAMOS LOS MÓDULOS DE RECAPTCHA
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha'; // <--- NUEVO

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
    RouterLink,
    // 2. AGREGAMOS LOS MÓDULOS AQUÍ
    RecaptchaModule,      // <--- NUEVO
    RecaptchaFormsModule  // <--- NUEVO (Vital para que funcione con formGroup)
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export default class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private titleService = inject(Title);

  errorMessage: string | null = null;
  userNotFound = false;
  currentTheme: 'dark' | 'light' = 'dark';

  ngOnInit(): void {
    this.titleService.setTitle('Iniciar Sesión - CHAFATEC');
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  // 3. AGREGAMOS EL CONTROL 'recaptcha' AL FORMULARIO
  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
    recaptcha: ['', [Validators.required]] // <--- NUEVO: Validación requerida
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.userNotFound = false;

    // Al tomar .value, ahora incluirá { usuario, password, recaptcha }
    // Asegúrate de que tu AuthService maneje este objeto o extráelo si necesitas formatearlo diferente.
    const credentials = this.loginForm.value; 

    console.log('Enviando credenciales y token:', credentials); // <--- LOG PARA DEPURAR

    this.authService.login(credentials).subscribe({
       next: (response) => {
        const decodedToken = decodeToken(response.token);
        const userRole = decodedToken?.rol;

        if (userRole === 'alumno') {
          this.router.navigate(['/alumno/dashboard']);
        } else if (userRole === 'docente') {
          this.router.navigate(['/docente/dashboard']);
        } else if (userRole === 'administrativo') {
          this.router.navigate(['/admin/dashboard']);
        } else if (userRole === 'aspirante') {
          this.router.navigate(['/aspirante/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.userNotFound = true;
        } else if (err.status === 403) {
          this.errorMessage = err.error.message || 'El rol seleccionado no es correcto.';
        } else {
          this.errorMessage = 'Credenciales incorrectas.';
        }
        console.error('Error en el login:', err);
        
        // OPCIONAL: Resetear el captcha si falla el login para obligar a validarlo de nuevo
        // this.loginForm.get('recaptcha')?.reset(); 
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  get userFieldLabel(): string {
    return 'Correo / No. de Control';
  }
}