import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Asumiendo que estos servicios y modelos existen o serán creados
import { DocenteService } from '../../../../services/docente.service';
import { AuthService } from '../../../../services/auth'; // Correcto: Servicio del frontend
import { Docente } from '../../../../models/docente.model';

/**
 * Validador personalizado para asegurar que las contraseñas coincidan.
 */
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const nueva_contrasena = control.get('nueva_contrasena');
  const confirmar_contrasena = control.get('confirmar_contrasena');
  if (nueva_contrasena && confirmar_contrasena && nueva_contrasena.value !== confirmar_contrasena.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css']
})
export class MisDatosComponent implements OnInit, OnDestroy {
  // Forms
  editForm!: FormGroup;
  passwordForm!: FormGroup;
  verificationForm!: FormGroup;

  // User data
  docente: Docente | null = null;
  userId: number | null = null;

  // State management
  updateState: 'editing' | 'confirmingPassword' | 'verifyingCode' = 'editing';
  updateType: 'profile' | 'password' | null = null;
  isLoading = false;

  // User feedback
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  isMessageVisible = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadDocenteData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.editForm = this.fb.group({
      nombre_completo: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]]
    });

    this.passwordForm = this.fb.group({
      nueva_contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmar_contrasena: ['', Validators.required]
    }, { validators: passwordMatchValidator });

    this.verificationForm = this.fb.group({
      contrasena_actual: [''],
      update_code: ['', [Validators.pattern('^[0-9]{6}$')]]
    });
  }

  private loadDocenteData(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.docenteService.getDocenteById(this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.docente = data;
            this.editForm.patchValue({
              nombre_completo: data.nombre_completo,
              correo: data.correo,
              telefono: data.telefono,
              direccion: data.direccion
            });
            // Marcamos el formulario como "pristine" después de cargarlo
            this.editForm.markAsPristine();
          },
          error: () => {
            this.showMessage('Error al cargar los datos del perfil.', 'error');
          }
        });
    }
  }

  startUpdateProcess(type: 'profile' | 'password'): void {
    this.updateType = type;
    this.updateState = 'confirmingPassword';
    this.verificationForm.get('contrasena_actual')?.setValidators([Validators.required]);
    this.verificationForm.get('update_code')?.clearValidators();
    this.verificationForm.updateValueAndValidity();
  }

  requestUpdateCode(): void {
    if (this.verificationForm.get('contrasena_actual')?.invalid || !this.userId) return;

    this.isLoading = true;
    const contrasena_actual = this.verificationForm.get('contrasena_actual')?.value;

    this.docenteService.requestUpdateCode(this.userId, contrasena_actual)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.updateState = 'verifyingCode';
          this.verificationForm.get('contrasena_actual')?.clearValidators();
          this.verificationForm.get('update_code')?.setValidators([Validators.required, Validators.pattern('^[0-9]{6}$')]);
          this.verificationForm.updateValueAndValidity();
          this.showMessage('Código de verificación enviado a tu correo.', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showMessage(err.error.message || 'La contraseña actual es incorrecta.', 'error');
        }
      });
  }

  confirmAndSubmit(): void {
    if (this.verificationForm.get('update_code')?.invalid || !this.userId) return;

    this.isLoading = true;
    const updateData = {
      ... (this.updateType === 'profile' ? this.editForm.getRawValue() : {}),
      ... (this.updateType === 'password' ? { nueva_contrasena: this.passwordForm.value.nueva_contrasena } : {}),
      update_code: this.verificationForm.value.update_code
    };

    this.docenteService.updateDocente(this.userId, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showMessage(response.message || 'Perfil actualizado con éxito.', 'success');
          this.resetUpdateState();
          this.loadDocenteData(); // Recargar datos
          if (this.updateType === 'password') {
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.showMessage(err.error.message || 'Error al actualizar el perfil.', 'error');
        }
      });
  }

  cancelUpdate(): void {
    this.resetUpdateState();
  }

  private resetUpdateState(): void {
    this.updateState = 'editing';
    this.updateType = null;
    this.verificationForm.reset();
    this.passwordForm.reset();
    // No reseteamos el editForm para que el usuario no pierda sus cambios
  }

  /**
   * Muestra un mensaje de feedback al usuario.
   * @param content El texto del mensaje.
   * @param type El tipo de mensaje ('success' o 'error').
   * @param duration La duración en milisegundos.
   */
  private showMessage(content: string, type: 'success' | 'error', duration: number = 5000): void {
    this.message = content;
    this.messageType = type;
    this.isMessageVisible = true;

    setTimeout(() => {
      this.isMessageVisible = false;
    }, duration);
  }
}
