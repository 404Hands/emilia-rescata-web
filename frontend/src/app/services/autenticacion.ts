import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { InicioSesionFormulario } from '../interfaces/inicio-sesion-formulario';
import { RegistroFormulario } from '../interfaces/registro-formulario';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

@Service()
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/inicio-sesion`;

  private readonly usuarioActual = signal<Usuario | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();

  iniciarSesion(datos: InicioSesionFormulario): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.url}/`, {
        correo: datos.correo,
        clave: datos.clave,
        recordar: datos.recordar,
      })
      .pipe(tap(usuario => this.usuarioActual.set(usuario)));
  }

  registrar(datos: RegistroFormulario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/registro`, {
      nombre: datos.nombre,
      correo: datos.correo,
      clave: datos.clave,
    });
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
  }
}
