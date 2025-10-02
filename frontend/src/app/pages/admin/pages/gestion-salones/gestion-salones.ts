import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SalonService } from '../../../../services/salon.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-salones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-salones.html',
  styleUrl: './gestion-salones.css'
})
export default class GestionSalonesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private salonService = inject(SalonService);

  salones: any[] = [];
  salonForm: FormGroup;
  editForm: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  // Para el modal de edición/eliminación
  isModalOpen = false;
  selectedSalon: any = null;

  constructor() {
    this.salonForm = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      ubicacion: [''],
      descripcion: ['']
    });

    // Formulario para editar, no incluye la clave que no se debe modificar
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      ubicacion: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadSalones();
  }

  loadSalones(): void {
    this.salonService.getSalones().subscribe(data => this.salones = data);
  }

  onSubmit(): void {
    if (this.salonForm.invalid) {
      this.salonForm.markAllAsTouched();
      return;
    }

    this.salonService.createSalon(this.salonForm.value).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.loadSalones();
        this.salonForm.reset();
      },
      error: (err: HttpErrorResponse) => this.showMessage(err.error.message || 'Error desconocido.', 'error')
    });
  }

  // --- Métodos para el Modal de Edición/Eliminación ---

  openEditModal(salon: any): void {
    this.selectedSalon = { ...salon };
    this.editForm.patchValue(this.selectedSalon);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedSalon = null;
    this.editForm.reset();
  }

  onUpdate(): void {
    if (this.editForm.invalid || !this.selectedSalon) return;

    this.salonService.updateSalon(this.selectedSalon.id, this.editForm.value).subscribe({
      next: (res) => {
        this.showMessage(res.message, 'success');
        this.loadSalones();
        this.closeModal();
      },
      error: (err: HttpErrorResponse) => this.showMessage(err.error.message || 'Error al actualizar.', 'error')
    });
  }

  onDelete(): void {
    if (!this.selectedSalon) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el salón "${this.selectedSalon.nombre}"?`)) {
      this.salonService.deleteSalon(this.selectedSalon.id).subscribe({
        next: (res) => {
          this.showMessage(res.message, 'success');
          this.loadSalones();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => this.showMessage(err.error.message || 'Error al eliminar.', 'error')
      });
    }
  }

  // --- Mensajes de feedback ---
  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
