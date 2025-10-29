import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './aspirante-login.component.html',
  styleUrls: ['./aspirante-login.component.css']
})
export default class AspiranteLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private titleService = inject(Title);

  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage: string | null = null;
  userNotFound = false;
  currentTheme: 'dark' | 'light' = 'dark';

  ngOnInit(): void {
    this.titleService.setTitle('Aspirantes - Iniciar Sesión');
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.userNotFound = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        const decodedToken = decodeToken(response.token);
        if (decodedToken?.rol === 'aspirante') {
          this.router.navigate(['/aspirante/dashboard']);
        } else {
          this.errorMessage = 'Error de autenticación. Rol no válido.';
          // Opcional: limpiar token si se guardó por error
          localStorage.removeItem('token');
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.userNotFound = true;
        } else if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas.';
        } else {
          this.errorMessage = err.error.message || 'Ocurrió un error en el servidor.';
        }
        console.error('Error en el login de aspirante:', err);
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
  }

  get userFieldLabel(): string {
    return 'Correo Electrónico';
  }
}