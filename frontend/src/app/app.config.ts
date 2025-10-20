import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provee las rutas definidas en app.routes.ts a la aplicación
    provideRouter(routes),
    // Provee HttpClient para poder hacer llamadas a la API y registra el interceptor de autenticación
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};