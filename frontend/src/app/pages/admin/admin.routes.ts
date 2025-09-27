// frontend/src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import AdminDashboardComponent from './pages/dashboard/dashboard';
import GestionUsuariosComponent from './pages/gestion-usuarios/gestion-usuarios';
import GestionCarrerasComponent from './pages/gestion-carreras/gestion-carreras';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    title: 'Panel de Administrador - CHAFATEC',
    children: [
      {
        // Ruta para la gestión de usuarios, se mostrará dentro del dashboard
        path: 'usuarios',
        component: GestionUsuariosComponent,
        title: 'Gestión de Usuarios - CHAFATEC'
      },
      {
        // Ruta para la gestión de carreras
        path: 'carreras',
        component: GestionCarrerasComponent,
        title: 'Gestión de Carreras - CHAFATEC'
         },
      {
        path: 'materias',
        loadComponent: () => import('./pages/gestion-materias/gestion-materias')
      }
    ]
  },
  {
    // Redirige la ruta base /admin a /admin/dashboard
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];