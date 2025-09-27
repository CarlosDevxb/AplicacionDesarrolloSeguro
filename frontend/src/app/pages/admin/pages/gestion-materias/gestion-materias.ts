import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { CarreraService } from '../../../../services/carrera.service';
import { MateriaService } from '../../../../services/materia.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-materias.html',
  styleUrl: './gestion-materias.css'
})
export default class GestionMateriasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private carreraService = inject(CarreraService);
  private materiaService = inject(MateriaService);

  // Bloques colapsables
  showCreateBlock = false;
  showSearchBlock = false;

  // Formularios
  materiaForm: FormGroup;
  searchControl = new FormControl('');

  // Datos
  carreras: any[] = [];
  searchResults: any[] = [];
  createMessage: string | null = null;
  searchMessage: string | null = null;

  constructor() {
    this.materiaForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      creditos: ['', [Validators.required, Validators.min(1)]],
      semestre: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      carreras: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.carreraService.getCarreras().subscribe(data => {
      this.carreras = data;
      this.addCarrerasCheckboxes();
    });
  }

  private addCarrerasCheckboxes() {
    const carrerasFormArray = this.materiaForm.get('carreras') as FormArray;
    this.carreras.forEach(() => carrerasFormArray.push(new FormControl(false)));
  }

  get carrerasFormArray() {
    return this.materiaForm.controls['carreras'] as FormArray;
  }

  createMateria() {
    if (this.materiaForm.invalid) return;

    const selectedCarreraIds = this.materiaForm.value.carreras
      .map((checked: boolean, i: number) => checked ? this.carreras[i].id : null)
      .filter((id: string | null) => id !== null);

    const materiaData = { ...this.materiaForm.value, carrera_ids: selectedCarreraIds };
    delete materiaData.carreras;

    this.materiaService.createMateria(materiaData).subscribe({
      next: res => {
        this.createMessage = res.message;
        this.materiaForm.reset();
        this.carrerasFormArray.clear();
        this.addCarrerasCheckboxes();
        setTimeout(() => this.createMessage = null, 5000);
      },
      error: (err: HttpErrorResponse) => this.createMessage = err.error.message || 'Error al crear la materia.'
    });
  }

  searchMateria() {
    const nombre = this.searchControl.value;
    if (!nombre) return;
    this.searchMessage = 'Buscando...';
    this.materiaService.findMateriaByName(nombre).subscribe({
      next: results => {
        this.searchResults = results;
        this.searchMessage = results.length === 0 ? 'No se encontraron materias con ese nombre.' : null;
      },
      error: (err: HttpErrorResponse) => this.searchMessage = err.error.message || 'Error en la búsqueda.'
    });
  }
}