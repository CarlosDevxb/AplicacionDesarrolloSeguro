// frontend/src/app/pages/docente/docente.routes.ts
import { Routes } from '@angular/router';
import { DocenteDashboardComponent } from './pages/dashboard/dashboard';

export const DOCENTE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DocenteDashboardComponent,
    title: 'Panel de Docente - CHAFATEC'
  },
];