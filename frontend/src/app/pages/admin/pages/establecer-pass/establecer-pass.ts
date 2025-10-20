import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Validador personalizado para asegurar que las contraseñas coincidan
function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('nueva_contrasena');
  const confirmar = control.get('confirmar_contrasena');
  return nueva && confirmar && nueva.value !== confirmar.value ? { mismatch: true } : null;
}

@Component({
  selector: 'app-establecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './establecer-pass.html',
  styleUrls: ['./establecer-pass.css']
})
export class EstablecerPass implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);

  passwordForm: FormGroup;
  token: string | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  isSuccess = false;

  constructor() {
    this.passwordForm = this.fb.group({
      nueva_contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmar_contrasena: ['', Validators.required]
    }, { validators: passwordMatcher });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Establecer Contraseña - CHAFATEC');
    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.showMessage('No se proporcionó un token válido. Por favor, solicita un nuevo enlace.', 'error');
      this.passwordForm.disable();
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.token) {
      return;
    }

    // --- Lógica de prueba ---
    // Por ahora, solo mostraremos los datos en la consola para verificar.
    console.log('Token:', this.token);
    console.log('Nueva Contraseña:', this.passwordForm.value.nueva_contrasena);

    // Simulamos una respuesta exitosa del backend
    this.showMessage('¡Tu contraseña ha sido establecida con éxito!', 'success');
    this.isSuccess = true;
    this.passwordForm.disable();

    // En un caso real, aquí llamarías a un servicio:
    /*
    this.authService.resetPassword(this.token, this.passwordForm.value.nueva_contrasena).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.isSuccess = true;
        this.passwordForm.disable();
      },
      error: (err) => this.showMessage(err.error.message, 'error')
    });
    */
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
  }
}