import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import type {
  Mascota,
  MascotaActualizacion,
  MascotaCreacion,
} from '../interfaces/mascota';

@Service()
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mascotas`;

  private readonly existencias = signal<Mascota[]>([]);
  readonly mascotas = this.existencias.asReadonly();

  readonly cargando = signal(false);

  listar(): Observable<Mascota[]> {
    return this.http
      .get<Mascota[]>(this.url)
      .pipe(tap(mascotas => this.existencias.set(mascotas)));
  }

  cargar(): Observable<Mascota[]> {
    this.cargando.set(true);

    return this.listar().pipe(finalize(() => this.cargando.set(false)));
  }

  obtener(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.url}/${id}`);
  }

  crear(datos: MascotaCreacion, fotos: (File | null)[]): Observable<Mascota> {
    return this.http.post<Mascota>(this.url, this.formulario(datos, fotos)).pipe(
      tap(mascota => {
        this.existencias.update(lista => [...lista, mascota]);
      })
    );
  }

  actualizar(
    id: number,
    datos: MascotaActualizacion,
    fotos: (File | null)[],
    quitar: boolean[] = []
  ): Observable<Mascota> {
    const formulario = this.formulario(datos, fotos);

    quitar.forEach((eliminar, posicion) => {
      if (eliminar && posicion > 0) {
        formulario.append(`quitar_extra_${posicion}`, 'true');
      }
    });

    return this.http.put<Mascota>(`${this.url}/${id}`, formulario).pipe(
      tap(mascota => {
        this.existencias.update(lista =>
          lista.map(item => (item.id === id ? mascota : item))
        );
      })
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.existencias.update(lista => lista.filter(item => item.id !== id));
      })
    );
  }

  urlFoto(id: number, posicion = 0): string {
    return `${this.url}/${id}/fotos/${posicion}`;
  }

  private formulario(
    datos: MascotaCreacion,
    fotos: (File | null)[]
  ): FormData {
    const formulario = new FormData();
    formulario.append('datos', JSON.stringify(datos));

    fotos.forEach((foto, posicion) => {
      if (!foto) {
        return;
      }

      const campo =
        posicion === 0 ? 'foto_principal' : `foto_extra_${posicion}`;

      formulario.append(campo, foto);
    });

    return formulario;
  }
}
