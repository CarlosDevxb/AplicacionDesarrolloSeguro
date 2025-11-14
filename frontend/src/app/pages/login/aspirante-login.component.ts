import { Component, inject, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

@Component({
  selector: 'app-aspirante-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './aspirante-login.component.html',
  styleUrls: ['./aspirante-login.component.css'] // Reutiliza estilos
})
export default class AspiranteLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private titleService = inject(Title);

  errorMessage: string | null = null;
  currentTheme: 'dark' | 'light' = 'dark';

  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.email]], // 'usuario' es el correo para aspirantes
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.titleService.setTitle('Aspirantes - CHAFATEC');
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const credentials = this.loginForm.value;

    this.authService.aspiranteLogin(credentials).subscribe({
      next: (response) => {
        const decodedToken = decodeToken(response.token);
        const userRole = decodedToken?.rol;

        if (userRole === 'aspirante') {
          this.router.navigate(['/aspirante/dashboard']);
        } else {
          // Si por alguna razón el rol no es 'aspirante', redirigir al login principal
          this.errorMessage = 'Acceso no autorizado para este panel.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.errorMessage = 'No se encontró una cuenta de aspirante con ese correo.';
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        }
        console.error('Error en el login de aspirante:', err);
      }
    });
  }

  /**
   * Navega a la página de registro.
   */
  goToRegistro(): void {
    this.router.navigate(['/registro']);
  }

  /**
   * Cambia entre el tema oscuro y claro.
   */
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }
}