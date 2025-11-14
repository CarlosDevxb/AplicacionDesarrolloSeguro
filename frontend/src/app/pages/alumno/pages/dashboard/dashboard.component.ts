import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth';
import { SessionTimerService } from '../../../../services/session-timer.service';

@Component({
  selector: 'app-alumno-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.css']
})
export class AlumnoDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private sessionTimerService = inject(SessionTimerService);
  
  isSidebarCollapsed = false;
  alumno: any = null;


  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.sessionTimerService.startTimers();
        this.alumno = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del alumno', err);
        this.authService.logout();
      }
    });
  }

  // Métodos para controlar la UI
  toggleSidebar(event?: MouseEvent) {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
