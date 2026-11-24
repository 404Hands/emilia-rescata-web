import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  imports: [RouterLink],
  selector: 'app-header-inicio-sesion',
  styleUrl: './header-inicio-sesion.css',
  templateUrl: './header-inicio-sesion.html',
})

export class HeaderInicioSesion {
  private router = inject(Router);

  volver() {
    if (this.router.url === '/registro') {
      this.router.navigate(['/inicio-sesion']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}