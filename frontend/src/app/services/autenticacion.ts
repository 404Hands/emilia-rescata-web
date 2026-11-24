import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { InicioSesionFormulario } from '../interfaces/inicio-sesion-formulario';
import { RegistroFormulario } from '../interfaces/registro-formulario';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface Sesion {
  usuario: Usuario;
  token: string;
}

const claveSesion = 'emilia-rescata-sesion';

@Service()
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly url = `${environment.apiUrl}/api/inicio-sesion`;

  private readonly sesion = signal<Sesion | null>(this.leerSesion());

  usuario(): Usuario | null {
    return this.sesion()?.usuario ?? null;
  }

  token(): string | null {
    return this.sesion()?.token ?? null;
  }

  private leerSesion(): Sesion | null {
    if (!this.navegador) return null;
    try {
      const guardada = sessionStorage.getItem(claveSesion) ?? localStorage.getItem(claveSesion);
      return guardada ? JSON.parse(guardada) : null;
    } catch {
      return null;
    }
  }

  iniciarSesion(datos: InicioSesionFormulario): Observable<Usuario> {
    return this.http
      .post<Usuario & { token: string }>(`${this.url}/`, {
        correo: datos.correo,
        clave: datos.clave,
        recordar: datos.recordar,
      })
      .pipe(map(({ token, ...usuario }) => {
        const sesion = { usuario, token };
        this.sesion.set(sesion);
        if (this.navegador) {
          sessionStorage.removeItem(claveSesion);
          localStorage.removeItem(claveSesion);
          const almacenamiento = datos.recordar ? localStorage : sessionStorage;
          almacenamiento.setItem(claveSesion, JSON.stringify(sesion));
        }
        return usuario;
      }));
  }

  registrar(datos: RegistroFormulario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/registro`, {
      nombre: datos.nombre,
      correo: datos.correo,
      clave: datos.clave,
    });
  }

  cerrarSesion(): Observable<void> {
    if (!this.token()) return of(undefined);
    return this.http.post<void>(`${this.url}/salir`, {}).pipe(tap(() => this.limpiarSesion()));
  }

  limpiarSesion(): void {
    this.sesion.set(null);
    if (this.navegador) {
      sessionStorage.removeItem(claveSesion);
      localStorage.removeItem(claveSesion);
    }
  }
}

export const agregarToken: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(AutenticacionService).token();
  if (token && peticion.url.startsWith(`${environment.apiUrl}/`)) {
    peticion = peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return siguiente(peticion);
};
