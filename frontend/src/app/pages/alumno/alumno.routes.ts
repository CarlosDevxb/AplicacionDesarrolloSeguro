// frontend/src/app/pages/alumno/alumno.routes.ts
import { Routes } from '@angular/router';
import AlumnoDashboardComponent from './dashboard.component';

export const ALUMNO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AlumnoDashboardComponent,
    title: 'Portal del Alumno - CHAFATEC'
  },
];