import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
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
  templateUrl: './menu-alumno-edit.html',
  styleUrl: './menu-alumno-edit.css'
})
export default class MenuAlumnoEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private titleService = inject(Title);

  // Estado de la UI
  isSidebarCollapsed = false; // Usamos isSidebarCollapsed para consistencia con el dashboard
  alumno: any = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  // Formularios
   editForm: FormGroup;
  passwordForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });

    this.passwordForm = this.fb.group({
      contrasena_actual: ['', Validators.required],
      nueva_contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_contrasena: ['', Validators.required]
    }, { validators: passwordMatcher });
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
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = null, 4000);
  }

  // --- Métodos del Formulario ---
  updateProfile() {
    if (this.editForm.invalid || !this.editForm.dirty) return;
    this.authService.updateProfile(this.editForm.value).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.editForm.markAsPristine(); // Marcar como no modificado después de guardar
      },
      error: (err: HttpErrorResponse) => this.showMessage(err.error.message || 'Error al actualizar.', 'error')
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.passwordForm.reset();
      },
      error: (err: HttpErrorResponse) => this.showMessage(err.error.message || 'Error al cambiar contraseña.', 'error')
    });
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
