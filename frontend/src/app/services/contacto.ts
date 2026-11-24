import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ContactoFormulario } from '../interfaces/contacto-formulario';

export interface ContactoRegistrado {
  id: number;
  nombre: string;
  ciudad: string;
  correo: string;
  telefono: string;
  mensaje: string;
}

@Service()
export class ContactoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/contactos`;

  enviar(datos: ContactoFormulario): Observable<ContactoRegistrado> {
    const { nombre, ciudad, correo, telefono, mensaje } = datos;

    return this.http.post<ContactoRegistrado>(`${this.url}/`, {
      nombre,
      ciudad,
      correo,
      telefono,
      mensaje,
    });
  }
}
