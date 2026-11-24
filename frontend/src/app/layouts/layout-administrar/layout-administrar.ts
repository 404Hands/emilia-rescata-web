import { Component, inject, signal } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { Router, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { AutenticacionService } from '../../services/autenticacion';
import { mensajeDeError } from '../../services/http-error';
@Component({
  imports: [HeaderAdmin, RouterOutlet, Footer],
  selector: 'app-layout-administrar',
  styleUrl: './layout-administrar.css',
  templateUrl: './layout-administrar.html',
})
export class LayoutAdministrar {
  readonly autenticacion = inject(AutenticacionService);
  readonly errorSalida = signal('');
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.errorSalida.set('');
    this.autenticacion.cerrarSesion().subscribe({
      next: () => this.router.navigate(['/inicio-sesion']),
      error: error => {
        if (error.status === 401) {
          this.autenticacion.limpiarSesion();
          this.router.navigate(['/inicio-sesion']);
        } else {
          this.errorSalida.set(mensajeDeError(error));
        }
      },
    });
  }
}
