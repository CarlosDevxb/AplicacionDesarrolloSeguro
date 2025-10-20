import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

// Validador personalizado para asegurar que las contraseñas coincidan
function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('password');
  const confirmar = control.get('confirmPassword');
  return nueva && confirmar && nueva.value !== confirmar.value ? { mismatch: true } : null;
}

@Component({
  selector: 'app-establecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // RouterLink para el enlace a /login
  templateUrl: './establecer-contrasena.component.html',
  styleUrls: ['./establecer-contrasena.component.css']
})
export default class EstablecerContrasenaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private authService = inject(AuthService);

  passwordForm: FormGroup;
  token: string | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  isSuccess = false;

  constructor() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatcher });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Establecer Contraseña - CHAFATEC');
    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.showMessage('Token no válido o ausente. Por favor, utiliza el enlace de tu correo.', 'error');
      this.passwordForm.disable();
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.token) {
      return;
    }

    // Extraemos los valores del formulario
    const { password } = this.passwordForm.value;

    // Llamamos al servicio de autenticación para enviar el token y la nueva contraseña
    this.authService.resetPassword(this.token, password).subscribe({
      next: (res) => {
        // Si la respuesta es exitosa, mostramos el mensaje y deshabilitamos el formulario
        this.showMessage(res.message, 'success');
        this.isSuccess = true;
        this.passwordForm.disable();
      },
      error: (err: HttpErrorResponse) => {
        // Si hay un error (ej: token inválido), mostramos el mensaje de error del backend
        const errorMessage = err.error?.message || 'Ocurrió un error. Inténtalo de nuevo.';
        this.showMessage(errorMessage, 'error');
        this.passwordForm.disable(); // También deshabilitamos el formulario si el token es inválido para evitar reintentos
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
  }
}