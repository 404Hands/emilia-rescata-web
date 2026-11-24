import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';

import { ContactoFormulario } from '../../interfaces/contacto-formulario';
import { ContactoService } from '../../services/contacto';
import { mensajeDeError } from '../../services/http-error';

@Component({
  imports: [FormField],
  selector: 'app-contacto',
  styleUrl: './contacto.css',
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly contactoService = inject(ContactoService);

  intentoEnvio = signal(false);
  mensajeEnviado = signal(false);
  mensajeError = signal('');
  enviando = signal(false);

  contactoModelo = signal<ContactoFormulario>({
    nombre: '',
    ciudad: '',
    correo: '',
    telefono: '',
    mensaje: '',
    robot: false,
  });

  contactoFormulario = form(this.contactoModelo, schema => {
    required(schema.nombre, { message: 'El nombre es obligatorio' });
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.mensaje, { message: 'El mensaje es obligatorio' });
    required(schema.robot, { message: 'Confirma que no eres un robot' });
  });

  guardar(evento: Event): void {
    evento.preventDefault();
    this.intentoEnvio.set(true);
    this.mensajeEnviado.set(false);
    this.mensajeError.set('');

    if (this.contactoFormulario().invalid() || this.enviando()) {
      return;
    }

    this.enviando.set(true);

    this.contactoService.enviar(this.contactoModelo()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.mensajeEnviado.set(true);
      },
      error: error => {
        this.enviando.set(false);
        this.mensajeError.set(mensajeDeError(error));
      },
    });
  }
}
