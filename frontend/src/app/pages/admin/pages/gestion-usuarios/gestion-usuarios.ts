import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { CarreraService } from '../../../../services/carrera.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export default class GestionUsuariosComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private carreraService = inject(CarreraService);

  // Control de visibilidad de los bloques
  showCreateBlock: 'alumno' | 'docente' | 'administrativo' | null = null;
  showSearchBlock = false;

  // Formularios
  alumnoForm: FormGroup;
  docenteForm: FormGroup;
  adminForm: FormGroup;
  searchControl = new FormControl('');
  editForm: FormGroup;

  // Datos y mensajes
  carreras: any[] = [];
  searchedUser: any = null;
  searchMessage: string | null = null;
  createMessage: string | null = null;
  updateMessage: string | null = null;

  constructor() {
    this.alumnoForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      carrera_id: ['', Validators.required],
      fecha_ingreso: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.docenteForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.adminForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.editForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      rol: ['', Validators.required], // Campo para el rol del usuario
      estado: ['', Validators.required], // Campo para el estado de la cuenta
      estatus: [''] // Campo para el estatus académico del alumno
    });

    this.carreraService.getCarreras().subscribe(data => this.carreras = data);
  }

  toggleCreateBlock(type: 'alumno' | 'docente' | 'administrativo' | null) {
    this.showCreateBlock = this.showCreateBlock === type ? null : type;
  }

  toggleSearchBlock() {
    this.showSearchBlock = !this.showSearchBlock;
    this.searchedUser = null;
    this.searchMessage = null;
  }

  createUser(role: 'alumno' | 'docente' | 'administrativo') {
    const form = role === 'alumno' ? this.alumnoForm : (role === 'docente' ? this.docenteForm : this.adminForm);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const userData = { ...form.value, rol: role };
    this.adminService.createUser(userData).subscribe({
      next: res => {
        this.createMessage = res.message;
        form.reset();
        setTimeout(() => this.createMessage = null, 5000);
      },
      error: (err: HttpErrorResponse) => this.createMessage = err.error.message || 'Error al crear usuario.'
    });
  }

  searchUser() {
    const id = this.searchControl.value;
    if (!id) return;
    this.searchMessage = 'Buscando...';
    this.searchedUser = null;
    this.adminService.findUserById(id).subscribe({
      next: user => {
        this.searchedUser = user;
        this.searchMessage = null;
        this.editForm.patchValue(user); // Carga datos de la tabla 'usuarios'
        // Si el usuario es un alumno, también cargamos su estatus en el form
        if (user.Alumno) {
          this.editForm.patchValue({ estatus: user.Alumno.estatus });
        }
      },
      error: (err: HttpErrorResponse) => this.searchMessage = err.error.message || 'Error en la búsqueda.'
    });
  }

  updateUser() {
    if (this.editForm.invalid || !this.searchedUser) return;
    this.adminService.updateUser(this.searchedUser.id, this.editForm.value).subscribe({
      next: res => {
        this.updateMessage = res.message;
        // Volvemos a buscar al usuario para refrescar los datos en la pantalla
        this.searchUser();
        setTimeout(() => this.updateMessage = null, 5000);
      },
      error: (err: HttpErrorResponse) => this.updateMessage = err.error.message || 'Error al actualizar.'
    });
  }
}