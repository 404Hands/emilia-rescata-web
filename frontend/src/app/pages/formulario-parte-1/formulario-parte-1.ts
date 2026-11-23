import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { SolicitudFormulario } from '../../interfaces/solicitud-formulario';
import { SolicitudFormularioService } from '../../services/solicitud-formulario';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-formulario-parte-1',
  styleUrl: './formulario-parte-1.css',
  templateUrl: './formulario-parte-1.html',
})
export class FormularioParte1 {
  private solicitudFormularioService = inject(SolicitudFormularioService);
  private router = inject(Router);

  intentoEnvio = signal(false);

  solicitudModelo = signal<SolicitudFormulario>({ ...this.solicitudFormularioService.datos() });

  solicitudFormulario = form(this.solicitudModelo, (schema) => {
    required(schema.nombre, { message: 'El nombre es obligatorio' });
    required(schema.celular, { message: 'El número de celular es obligatorio' });
    pattern(schema.celular, /^\d{9}$/, { message: 'Ingrese un celular de 9 dígitos' });
    required(schema.distrito, { message: 'El distrito o provincia es obligatorio' });
  });

  siguiente(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.solicitudFormulario().invalid()) {
      return;
    }

    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    this.router.navigate(['/formulario-parte-2']);
  }
}