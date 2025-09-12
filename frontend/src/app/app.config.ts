// frontend/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Para hacer peticiones API
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),      // Habilita el sistema de rutas de la app
    provideHttpClient()         // Habilita HttpClient para toda la app
  ]
};