import { Injectable } from '@angular/core';
import { AuthService } from './auth';

const WARNING_TIME = 2 * 60 * 1000; // 2 minutos para advertir
const COUNTDOWN_SECONDS = 60; // 1 minuto de cuenta regresiva

@Injectable({
  providedIn: 'root'
})
export class SessionTimerService {
  private sessionTimeout: any;
  private warningTimeout: any;

  constructor(
    private authService: AuthService,

  ) {}

  startTimers() {
    this.clearTimers();
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiration = expirationTime - now;

      if (timeUntilExpiration <= 0) {
        this.logout(true);
        return;
      }

      // Timer para mostrar el modal de advertencia
      const warningTimer = timeUntilExpiration - WARNING_TIME;
      if (warningTimer > 0) {
        this.warningTimeout = setTimeout(() => this.openWarningModal(), warningTimer);
      }

      // Timer para cerrar la sesión si no hay interacción
      this.sessionTimeout = setTimeout(() => this.logout(true), timeUntilExpiration);

    } catch (e) {
      console.error('Token inválido, cerrando sesión.', e);
      this.logout(false);
    }
  }

  clearTimers() {
    clearTimeout(this.warningTimeout);
    clearTimeout(this.sessionTimeout);
  }

  private openWarningModal() {
    // Usamos un confirm simple para demostrar el flujo.
    // En una app real, aquí abrirías tu componente de modal personalizado.
    const wantsToContinue = window.confirm(
      `Tu sesión está a punto de expirar. ¿Deseas continuar?`
    );

    if (wantsToContinue) {
      this.authService.refreshToken().subscribe(() => {
        console.log('Sesión extendida.');
        this.startTimers(); // Reiniciar timers con el nuevo token
      });
    } else {
      this.logout(true);
    }
  }

  private logout(expired: boolean) {
    this.clearTimers();
    this.authService.logout({ sessionExpired: expired });
  }

  ngOnDestroy() {
    this.clearTimers();
  }
}
