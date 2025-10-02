// frontend/src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import AdminDashboardLayoutComponent from './pages/dashboard/dashboard';
import GestionUsuariosComponent from './pages/gestion-usuarios/gestion-usuarios';
import GestionCarrerasComponent from './pages/gestion-carreras/gestion-carreras';
import AdminDashboardHomeComponent from './pages/dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent, // Este es el componente con el layout (sidebar, etc.)
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardHomeComponent,
        data: { title: 'Dashboard', subtitle: 'Resumen general y estadísticas del sistema.' }
      },
      {
        path: 'usuarios',
        component: GestionUsuariosComponent,
        data: { title: 'Gestión de Usuarios', subtitle: 'Crea, busca y edita usuarios del sistema.' }
      },
      {
        path: 'carreras',
        component: GestionCarrerasComponent,
        data: { title: 'Gestión de Carreras', subtitle: 'Administra las carreras ofrecidas por la institución.' }
      },
      {
        path: 'materias',
        loadComponent: () => import('./pages/gestion-materias/gestion-materias'),
        data: { title: 'Gestión de Materias', subtitle: 'Crea y organiza las materias de cada carrera.' }
      },
      {
        path: 'salones',
        loadComponent: () => import('./pages/gestion-salones/gestion-salones'),
        data: { title: 'Gestión de Salones', subtitle: 'Administra los salones, laboratorios y auditorios.' }
      },
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
    ]
  },
];