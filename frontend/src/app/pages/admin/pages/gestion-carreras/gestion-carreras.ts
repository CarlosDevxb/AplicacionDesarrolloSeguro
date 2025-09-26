import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarreraService } from '../../../../services/carrera.service';

@Component({
  selector: 'app-gestion-carreras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-carreras.html',
  styleUrl: './gestion-carreras.css'
})
export default class GestionCarrerasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private carreraService = inject(CarreraService);

  carreras: any[] = [];
  carreraForm: FormGroup;
  isEditMode = false;
  currentCarreraId: number | null = null;

  constructor() {
    this.carreraForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadCarreras();
  }

  loadCarreras(): void {
    this.carreraService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras', err)
    });
  }

  onSubmit(): void {
    if (this.carreraForm.invalid) return;

    // La lógica ahora solo es para actualizar
    if (this.isEditMode && this.currentCarreraId) {
      this.carreraService.updateCarrera(this.currentCarreraId, this.carreraForm.value).subscribe(() => {
        this.closeModal();
        this.loadCarreras();
      });
    }
  }

  // Abre el modal y carga los datos de la carrera seleccionada
  editCarrera(carrera: any): void {
    this.isEditMode = true;
    this.currentCarreraId = carrera.id;
    this.carreraForm.patchValue({
      nombre: carrera.nombre,
      descripcion: carrera.descripcion
    });
  }

  // Cierra el modal y limpia el estado
  closeModal(): void {
    this.isEditMode = false;
    this.currentCarreraId = null;
    this.carreraForm.reset();
  }
}