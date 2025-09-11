// frontend/src/app/app.routes.ts

import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login')
    },
    { // <-- AÑADE ESTA NUEVA RUTA
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)
    },
];