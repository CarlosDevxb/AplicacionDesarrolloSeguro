import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-establecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './establecer-contrasena.component.html',
  styleUrls: ['./establecer-contrasena.component.css', '../login/login.css'] // Reutilizamos estilos
})
export default class EstablecerContrasenaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private titleService = inject(Title);

  passwordForm!: FormGroup;
  token: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  showForm = false; // Controla la visibilidad del formulario

  ngOnInit(): void {
    this.titleService.setTitle('Establecer Contraseña - CHAFATEC');
    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.errorMessage = 'Token no proporcionado. El enlace puede estar roto.';
      return;
    }

    // Validamos el token al cargar el componente
    this.authService.validarTokenEstablecimiento(this.token).subscribe({
      next: () => {
        this.showForm = true; // El token es válido, mostramos el formulario
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'El enlace es inválido, ha expirado o ya fue utilizado.';
        this.showForm = false; // El token no es válido, no mostramos el formulario
      }
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.token) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { password } = this.passwordForm.value;

    this.authService.establecerContrasena(this.token, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message + ' Serás redirigido al login en 5 segundos.';
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      }
    });
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}