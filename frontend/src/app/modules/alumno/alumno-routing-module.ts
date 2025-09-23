// En /home/carloslnx/Escritorio/App/AplicacionDesarrolloSeguro/frontend/src/app/modules/alumno/alumno-routing-module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard'; // Importa el nuevo componente

const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
