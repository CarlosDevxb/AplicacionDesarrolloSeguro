import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.router.events.pipe(
      // 1. Escuchamos solo los eventos de final de navegación
      filter(event => event instanceof NavigationEnd),
      // 2. Obtenemos la información de la ruta que se acaba de activar
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      // 3. Nos aseguramos de que la ruta tenga datos y un título definido
      filter(route => route.outlet === 'primary'),
      map(route => route.snapshot.data['title'])
    ).subscribe((title: string) => {
      // 4. Usamos el servicio Title para cambiar el título de la página
      if (title) {
        this.titleService.setTitle(title);
      }
    });
  }
}