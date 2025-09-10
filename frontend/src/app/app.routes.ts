// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login', // Si alguien entra a la raíz, lo mandas a /login
        pathMatch: 'full'
    },
    {
        path: 'login',
        // Carga el componente de login solo cuando se visita esta ruta
        loadComponent: () => import('./pages/login/login')
    },
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./pages/dashboard/dashboard')
    // }
];