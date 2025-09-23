import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'] // Asumo que tienes un archivo CSS con este nombre
})
export default class NotFoundComponent {
  // No se necesita lógica aquí para una página 404 simple
}