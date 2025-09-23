import { Routes } from '@angular/router';

// Importa tus componentes de página y el nuevo componente NotFound
import LoginComponent from './pages/login/login';
import NotFoundComponent from './components/not-found/not-found';
// Importamos los nuevos componentes de dashboard
import AlumnoDashboardComponent from './pages/alumno/dashboard.component';
import DocenteDashboardComponent from './pages/docente/dashboard.component';
import AdminDashboardComponent from './pages/admin/dashboard.component';
// Importamos el componente de registro que faltaba
import RegistroComponent from './pages/registro/registro';
// Importamos nuestro nuevo guard
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Ruta por defecto, redirige al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta para el componente de login
  { path: 'login', component: LoginComponent },

  // ¡RUTA AÑADIDA! Ahora Angular sabe qué mostrar en /registro
  { path: 'registro', component: RegistroComponent },

  // Rutas de los dashboards ahora protegidas por el roleGuard
  {
    path: 'alumno/dashboard',
    component: AlumnoDashboardComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'alumno' }
  },
  {
    path: 'docente/dashboard',
    component: DocenteDashboardComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'docente' }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'administrativo' }
  },

  // ¡ESTA ES LA RUTA CLAVE! Debe ser la última.
  { path: '**', component: NotFoundComponent }
];