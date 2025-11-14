import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin.service';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export default class GestionUsuariosComponent implements OnInit {
  private adminService = inject(AdminService);
  private titleService = inject(Title);

  users: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.titleService.setTitle('Gestión de Usuarios - Admin');
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }
}