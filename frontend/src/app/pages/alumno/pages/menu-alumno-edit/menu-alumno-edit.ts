import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

// Validador personalizado para contraseñas
function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('nueva_contrasena');
  const confirmar = control.get('confirmar_contrasena');
  if (nueva && confirmar && nueva.value !== confirmar.value) {
    return { mismatch: true };
  }
  return null; // Si no hay error, retorna null
}

@Component({
  selector: 'app-menu-alumno-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './menu-alumno-edit.html', // El HTML no cambia
  styleUrl: './menu-alumno-edit.css' // Asegúrate de que este archivo exista
})
export default class MenuAlumnoEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private titleService = inject(Title);

  // --- Estados de la UI ---
  isSidebarCollapsed = false;
  alumno: any = null;
  message: string | null = null;
  isMessageVisible = false; // Nuevo estado para controlar la animación
  messageType: 'success' | 'error' = 'success';
  // Máquina de estados para el flujo de actualización del perfil
  isLoading = false; // Estado para la animación de carga
  updateState: 'editing' | 'confirmingPassword' | 'verifyingCode' = 'editing';
  // Variable para saber qué acción se está confirmando ('profile' o 'password')
  actionToConfirm: 'profile' | 'password' | null = null;

  // --- Formularios ---
  editForm: FormGroup;
  passwordForm: FormGroup;
  // Nuevo formulario para el proceso de verificación
  verificationForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });

    this.passwordForm = this.fb.group({
      nueva_contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_contrasena: ['', Validators.required]
    }, { validators: passwordMatcher });

    this.verificationForm = this.fb.group({
      contrasena_actual: ['', Validators.required],
      update_code: [''] // Se hará requerido en el paso de verificación
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Editar Perfil - CHAFATEC');
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.alumno = data;
        this.editForm.patchValue(this.alumno);
      },
      error: (err) => {
        console.error('Error al obtener el perfil del alumno', err);
        this.authService.logout();
      }
    });
  }

  // --- Métodos de UI ---
  toggleSidebar(event?: MouseEvent) {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  logout() { this.authService.logout(); }
  private showMessage(msg: string, type: 'success' | 'error') {
    this.messageType = type;
    this.message = msg;
    this.isMessageVisible = true; // Activa la animación de entrada

    setTimeout(() => {
      this.isMessageVisible = false; // Activa la animación de salida
      setTimeout(() => this.message = null, 300); // Borra el mensaje después de la animación
    }, 4000);
  }

  // --- Métodos del Formulario de Perfil (Flujo de 2 Pasos) ---

  // PASO 1: El usuario hace clic en "Guardar" en cualquiera de los dos formularios
  startUpdateProcess(action: 'profile' | 'password') {
    if (action === 'profile' && (this.editForm.invalid || !this.editForm.dirty)) return;
    if (action === 'password' && this.passwordForm.invalid) return;

    this.actionToConfirm = action;
    this.updateState = 'confirmingPassword';
    this.message = null; // Limpiamos mensajes previos
  }

  // PASO 2: El usuario envía su contraseña actual para obtener un código
  requestUpdateCode() {
    this.message = null;
    if (this.verificationForm.get('contrasena_actual')?.invalid) return;
    this.isLoading = true; // Inicia la carga

    const { contrasena_actual } = this.verificationForm.value;
    this.authService.requestUpdateCode(contrasena_actual).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.updateState = 'verifyingCode';
        this.isLoading = false; // Finaliza la carga
        // Hacemos el campo del código requerido para el siguiente paso
        this.verificationForm.get('update_code')?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
        this.verificationForm.get('update_code')?.updateValueAndValidity();
      },
      error: (err: HttpErrorResponse) => {
        this.showMessage(err.error.message || 'Error al solicitar el código.', 'error');
        this.isLoading = false; // Finaliza la carga en caso de error
      }
    });
  }

  // PASO 3: El usuario envía el código para finalizar la actualización
  confirmAndSubmit() {
    this.message = null;
    if (this.verificationForm.get('update_code')?.invalid) return;
    this.isLoading = true; // Inicia la carga

    const { update_code } = this.verificationForm.value;

    if (this.actionToConfirm === 'profile') {
      const finalData = { ...this.editForm.value, update_code };
      this.submitProfileUpdate(finalData);
    } else if (this.actionToConfirm === 'password') {
      const finalData = { nueva_contrasena: this.passwordForm.value.nueva_contrasena, update_code };
      this.submitPasswordChange(finalData);
    }
  }

  private submitProfileUpdate(data: any) {
    this.authService.updateProfile(data).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.editForm.markAsPristine();
        this.cancelUpdate(); // Volvemos al estado inicial
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.showMessage(err.error.message || 'Error al actualizar el perfil.', 'error');
        // Si el código expiró o es inválido, permitimos solicitar uno nuevo
        if (err.status === 410 || err.status === 401) {
          this.updateState = 'confirmingPassword';
          this.verificationForm.get('update_code')?.reset();
        }
        this.isLoading = false;
      }
    });
  }

  private submitPasswordChange(data: any) {
    this.authService.changePassword(data).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.passwordForm.reset();
        this.cancelUpdate(); // Volvemos al estado inicial
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.showMessage(err.error.message || 'Error al cambiar la contraseña.', 'error');
        // Si el código expiró o es inválido, permitimos solicitar uno nuevo
        if (err.status === 410 || err.status === 401) {
          this.updateState = 'confirmingPassword';
          this.verificationForm.get('update_code')?.reset();
        }
        this.isLoading = false;
      }
    });
  }

  // Cancela el proceso de actualización y vuelve al formulario de edición
  cancelUpdate() {
    this.updateState = 'editing';
    this.verificationForm.reset();
    this.actionToConfirm = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.authService.uploadProfilePicture(file).subscribe(res => this.alumno.foto = res.filePath);
    }
  }

  triggerFileInput(event: Event) {
    event.preventDefault();
    document.getElementById('foto')?.click();
  }
}
