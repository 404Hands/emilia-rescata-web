import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { SolicitudFormulario } from '../../interfaces/solicitud-formulario';
import { SolicitudFormularioService } from '../../services/solicitud-formulario';

@Component({
  imports: [FormField],
  selector: 'app-formulario-parte-3',
  styleUrl: './formulario-parte-3.css',
  templateUrl: './formulario-parte-3.html',
})
export class FormularioParte3 {
  private solicitudFormularioService = inject(SolicitudFormularioService);
  private router = inject(Router);

  intentoEnvio = signal(false);

  solicitudModelo = signal<SolicitudFormulario>({ ...this.solicitudFormularioService.datos() });

  solicitudFormulario = form(this.solicitudModelo, (schema) => {
    required(schema.motivo, { message: 'Cuéntanos por qué deseas adoptar' });
    required(schema.tiempoDisponible, { message: 'Selecciona el tiempo que tienes disponible' });
    required(schema.compromiso, { message: 'Debes aceptar la declaración de compromiso' });
  });

  anterior() {
    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    this.router.navigate(['/formulario-parte-2']);
  }

  guardar(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.solicitudFormulario().invalid()) {
      return;
    }

    this.solicitudFormularioService.guardarPaso(this.solicitudModelo());
    console.log(this.solicitudFormularioService.datos()); 
    this.router.navigate(['/formulario-parte-4']);
  }
}