import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';

const routes: Routes = [
  {
    path: 'dashboard', // Esta es la ruta que busca el login: /admin/dashboard
    component: Dashboard
  },
  {
    path: '', // Redirige /admin a /admin/dashboard por defecto
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
