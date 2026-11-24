import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Donacion,
  DonacionNueva,
  EstadoDonacion,
  MetodoPago,
} from '../interfaces/donacion';

export interface BorradorDonacion {
  monto: number;
  metodoPago: MetodoPago | '';
}

@Service()
export class DonacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/donaciones`;

  private readonly donaciones = signal<Donacion[]>([]);
  readonly lista = this.donaciones.asReadonly();

  private readonly borrador = signal<BorradorDonacion>({
    monto: 0,
    metodoPago: '',
  });
  readonly donacionEnCurso = this.borrador.asReadonly();
  readonly monto = computed(() => this.borrador().monto);

  establecerMonto(monto: number): void {
    this.borrador.update(datos => ({ ...datos, monto }));
  }

  actualizarMetodoPago(metodo: MetodoPago): void {
    this.borrador.update(datos => ({ ...datos, metodoPago: metodo }));
  }

  reiniciarBorrador(): void {
    this.borrador.set({ monto: 0, metodoPago: '' });
  }

  mostrarDonaciones(): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.url}/`).pipe(
      tap(donaciones => {
        this.donaciones.set(donaciones);
      })
    );
  }

  guardarDonacion(donacion: DonacionNueva): Observable<Donacion> {
    return this.http.post<Donacion>(`${this.url}/`, donacion).pipe(
      tap(guardada => {
        this.donaciones.update(lista => [...lista, guardada]);
      })
    );
  }

  actualizarDonacion(
    id: number,
    estado: EstadoDonacion
  ): Observable<Donacion> {
    return this.http.put<Donacion>(`${this.url}/${id}`, { estado }).pipe(
      tap(actualizada => {
        this.donaciones.update(lista =>
          lista.map(donacion =>
            donacion.id === id ? actualizada : donacion
          )
        );
      })
    );
  }

  eliminarDonacion(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.donaciones.update(lista =>
          lista.filter(donacion => donacion.id !== id)
        );
      })
    );
  }
}
