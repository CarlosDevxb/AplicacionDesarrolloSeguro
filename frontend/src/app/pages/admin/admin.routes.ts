// frontend/src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import AdminDashboardComponent from './pages/dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    // Redirige /admin a /admin/dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    // Carga el componente en /admin/dashboard
    path: 'dashboard',
    component: AdminDashboardComponent,
    title: 'Panel de Administrador - CHAFATEC'
  },
];