import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { CarreraService } from '../../../../services/carrera.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css', './gestion-usuarios-list.css'] // Añadimos los estilos para la lista
})
export default class GestionUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private carreraService = inject(CarreraService);

  // Control de visibilidad de los bloques
  showCreateBlock: 'alumno' | 'docente' | 'administrativo' | null = null;
  showSearchBlock = false;
  showListBlock = false; // Para el nuevo bloque de listado

  // Formularios
  alumnoForm!: FormGroup;
  docenteForm!: FormGroup;
  adminForm!: FormGroup;
  searchControl = new FormControl('');
  editForm!: FormGroup;

  // Datos y mensajes
  carreras: any[] = [];
  searchedUser: any = null;
  searchMessage: string | null = null;
  createMessage: string | null = null;
  updateMessage: string | null = null;

  // Para la lista de usuarios
  allUsers: any[] = [];
  listIsLoading = false;
  listErrorMessage: string | null = null;

  ngOnInit(): void {
    this.alumnoForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      carrera_id: ['', Validators.required],
      fecha_ingreso: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.docenteForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

    this.adminForm = this.fb.group({
      id: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      rol: ['', Validators.required],
      estado: ['activo', Validators.required], // Cambiado a string para coincidir con el modelo
      estatus: ['']
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

  toggleListBlock() {
    this.showListBlock = !this.showListBlock;
    // Si abrimos el bloque y la lista está vacía, la cargamos.
    if (this.showListBlock && this.allUsers.length === 0) {
      this.loadAllUsers();
    }
  }

  loadAllUsers() {
    this.listIsLoading = true;
    this.listErrorMessage = null;
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.allUsers = data;
        this.listIsLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.listErrorMessage = 'No se pudieron cargar los usuarios.';
        this.listIsLoading = false;
      }
    });
  }

  createUser(role: 'alumno' | 'docente' | 'administrativo') {
    const form = role === 'alumno' ? this.alumnoForm : (role === 'docente' ? this.docenteForm : this.adminForm);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const userData = { ...form.value, rol: role };
    this.adminService.createUser(userData).subscribe({
      next: (res: any) => {
        this.createMessage = res.message;
        form.reset();
        this.loadAllUsers(); // Recargamos la lista
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
      next: (user: any) => {
        this.searchedUser = user;
        this.searchMessage = null;
        this.editForm.patchValue(user);
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
      next: (res: any) => {
        this.updateMessage = res.message;
        this.searchUser(); // Refrescamos los datos del usuario editado
        if (this.showListBlock) { this.loadAllUsers(); } // Recargamos la lista si está visible
        setTimeout(() => this.updateMessage = null, 5000);
      },
      error: (err: HttpErrorResponse) => this.updateMessage = err.error.message || 'Error al actualizar.'
    });
  }
}