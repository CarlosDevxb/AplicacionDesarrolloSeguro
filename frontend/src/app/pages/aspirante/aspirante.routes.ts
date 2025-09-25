import { Routes } from '@angular/router';
import AspiranteDashboardComponent from './dashboard/dashboard';
export const ASPIRANTE_ROUTES: Routes = [
  {
    // Cuando la ruta sea solo /aspirante, redirige a /aspirante/dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    // Cuando la ruta sea /aspirante/dashboard, carga el componente del panel
    path: 'dashboard',
    component: AspiranteDashboardComponent,
    title: 'Portal del Aspirante - CHAFATEC'
  },
];