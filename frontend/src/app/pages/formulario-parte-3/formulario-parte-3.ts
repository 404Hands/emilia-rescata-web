import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

import { SolicitudFormulario } from '../../interfaces/solicitud-formulario';
import { SolicitudFormularioService } from '../../services/solicitud-formulario';
import { mensajeDeError } from '../../services/http-error';

@Component({
  imports: [FormField],
  selector: 'app-formulario-parte-3',
  styleUrl: './formulario-parte-3.css',
  templateUrl: './formulario-parte-3.html',
})
export class FormularioParte3 {
  private readonly solicitudFormularioService = inject(
    SolicitudFormularioService
  );
  private readonly router = inject(Router);

  intentoEnvio = signal(false);
  enviando = signal(false);
  mensaje = signal('');

  solicitudModelo = signal<SolicitudFormulario>({
    ...this.solicitudFormularioService.datos(),
  });

  solicitudFormulario = form(this.solicitudModelo, schema => {
    required(schema.motivo, { message: 'Cuéntanos por qué deseas adoptar' });
    required(schema.tiempoDisponible, {
      message: 'Selecciona el tiempo que tienes disponible',
    });
    required(schema.compromiso, {
      message: 'Debes aceptar la declaración de compromiso',
    });
  });

  anterior(): void {
    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    this.router.navigate(['/formulario-parte-2']);
  }

  guardar(evento: Event): void {
    evento.preventDefault();
    this.intentoEnvio.set(true);
    this.mensaje.set('');

    if (this.solicitudFormulario().invalid() || this.enviando()) {
      return;
    }

    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());

    this.enviando.set(true);

    this.solicitudFormularioService.enviar().subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/formulario-parte-4']);
      },
      error: error => {
        this.enviando.set(false);
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }
}
