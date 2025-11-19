// frontend/src/app/pages/docente/docente.routes.ts
import { Routes } from '@angular/router';
// Importamos el NUEVO componente del dashboard, el que tiene el menú lateral
import DocenteDashboardComponent from './pages/dashboard/dashboard';
import { DocenteInicioComponent } from './pages/dashboard/inicio.component';
import { MisDatosComponent } from './pages/mis-datos/mis-datos';

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
    title: 'Panel de Docente - CHAFATEC',
    children: [
      // Ruta por defecto del dashboard, muestra la bienvenida
      { path: '', component: DocenteInicioComponent, title: 'Inicio - Panel Docente' },
      // Ruta para la sección "Mis Datos"
      { path: 'mis-datos', component: MisDatosComponent, title: 'Mis Datos - Panel Docente' }
    ]
  },
];
