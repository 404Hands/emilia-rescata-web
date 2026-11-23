import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { SolicitudFormulario } from '../../interfaces/solicitud-formulario';
import { SolicitudFormularioService } from '../../services/solicitud-formulario';

@Component({
  imports: [FormField],
  selector: 'app-formulario-parte-2',
  styleUrl: './formulario-parte-2.css',
  templateUrl: './formulario-parte-2.html',
})
export class FormularioParte2 {
  private solicitudFormularioService = inject(SolicitudFormularioService);
  private router = inject(Router);

  intentoEnvio = signal(false);

  solicitudModelo = signal<SolicitudFormulario>({ ...this.solicitudFormularioService.datos() });

  solicitudFormulario = form(this.solicitudModelo, (schema) => {
    required(schema.tipoVivienda, { message: 'Selecciona el tipo de vivienda' });
    required(schema.propiedadVivienda, { message: 'Selecciona la situación de la vivienda' });
    required(schema.hayNinos, { message: 'Indica si hay niños en casa' });
    required(schema.otrasMascotas, { message: 'Indica si tienes otras mascotas' });
  });

  anterior() {
    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    this.router.navigate(['/formulario-parte-1']);
  }

  siguiente(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.solicitudFormulario().invalid()) {
      return;
    }

    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    this.router.navigate(['/formulario-parte-3']);
  }
}