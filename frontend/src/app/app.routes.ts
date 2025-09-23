import { Routes } from '@angular/router';

// Importa tus componentes de página
import LoginComponent from './pages/login/login'; // Componente para la página de login
import RegistroComponent from './pages/registro/registro'; // Componente para la página de registro
import { roleGuard } from './guards/role-guard'; // Importamos el guard de roles

export const routes: Routes = [
  // Ruta por defecto, redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Añadimos la propiedad 'title' a cada ruta
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión - CHAFATEC' },
  { path: 'registro', component: RegistroComponent, title: 'Solicitud de Ficha - CHAFATEC' },

  // --- Rutas Modulares con Carga Diferida (Lazy Loading) ---

  // Módulo de Alumno
  {
    path: 'alumno',
    canActivate: [roleGuard], // 1. Protegemos el acceso a todo el módulo
    data: { expectedRole: 'alumno' }, // 2. Definimos el rol esperado
    loadChildren: () => import('./pages/alumno/alumno.routes').then(m => m.ALUMNO_ROUTES)
  },

  // Módulo de Docente
  {
    path: 'docente',
    canActivate: [roleGuard],
    data: { expectedRole: 'docente' },
    loadChildren: () => import('./pages/docente/docente.routes').then(m => m.DOCENTE_ROUTES)
  },

  // Módulo de Administrador
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { expectedRole: 'administrativo' },
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)},

];