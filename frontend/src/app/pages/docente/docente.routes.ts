// frontend/src/app/pages/docente/docente.routes.ts
import { Routes } from '@angular/router';
// Importamos el NUEVO componente del dashboard, el que tiene el menú lateral
import DocenteDashboardComponent from './pages/dashboard/dashboard';

export const DOCENTE_ROUTES: Routes = [
  {
    // Cuando la ruta sea solo /docente, redirige a /docente/dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    // Cuando la ruta sea /docente/dashboard, carga el componente correcto
    path: 'dashboard',
    component: DocenteDashboardComponent,
    title: 'Panel de Docente - CHAFATEC'
  },
];
