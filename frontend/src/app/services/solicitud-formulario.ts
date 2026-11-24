import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { SolicitudFormulario } from '../interfaces/solicitud-formulario';

export interface SolicitudRegistrada extends SolicitudFormulario {
  id: number;
}

const solicitudVacia: SolicitudFormulario = {
  nombre: '',
  celular: '',
  distrito: '',
  tipoVivienda: '',
  propiedadVivienda: '',
  hayNinos: '',
  otrasMascotas: '',
  motivo: '',
  tiempoDisponible: '',
  compromiso: false,
};

@Service()
export class SolicitudFormularioService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/solicitudes`;

  readonly datos = signal<SolicitudFormulario>({ ...solicitudVacia });

  guardarPaso(datos: SolicitudFormulario): void {
    this.datos.set({ ...datos });
  }

  reiniciar(): void {
    this.datos.set({ ...solicitudVacia });
  }

  enviar(): Observable<SolicitudRegistrada> {
    return this.http
      .post<SolicitudRegistrada>(`${this.url}/`, this.datos())
      .pipe(tap(() => this.reiniciar()));
  }
}
