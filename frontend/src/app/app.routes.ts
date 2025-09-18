// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login').then(m => m.default) 
    },
    { 
        path: 'registro', 
        loadComponent: () => import('./pages/registro/registro').then(m => m.default) 
    },
    
    // --- RUTAS PROTEGIDAS (TAMBIÉN CON LA CORRECCIÓN) ---
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmincomponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'admin' }
    },
    {
        path: 'cliente/dashboard',
        loadComponent: () => import('./pages/dashboard-cliente/dashboard-cliente').then(m => m.DashboardClienteComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'cliente' }
    }
];