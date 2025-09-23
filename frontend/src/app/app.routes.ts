// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  // --- Rutas Públicas ---
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.default)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then(m => m.default)
  },
  
  // --- Rutas Protegidas por Módulos ---
  {
    path: 'alumno',
    loadChildren: () => import('./modules/alumno/alumno-module').then(m => m.AlumnoModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'alumno' }
  },
  {
    path: 'docente',
    loadChildren: () => import('./modules/docente/docente-module').then(m => m.DocenteModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'docente' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'administrativo' } // El rol en tu DB es 'administrativo'
  },

  // --- Redirecciones ---
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound)
  },  { path: '**', redirectTo: '/404' }
];