import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { ContactoFormulario } from '../../interfaces/contacto-formulario';

@Component({
  imports: [FormField],
  selector: 'app-contacto',
  styleUrl: './contacto.css',
  templateUrl: './contacto.html',
})
export class Contacto {
  
  intentoEnvio = signal(false);
  mensajeEnviado = signal(false);

  contactoModelo = signal<ContactoFormulario>({
    nombre: '',
    ciudad: '',
    correo: '',
    telefono: '',
    mensaje: '',
    robot: false,
  });

  contactoFormulario = form(this.contactoModelo, (schema) => {
    required(schema.nombre, { message: 'El nombre es obligatorio' });
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.mensaje, { message: 'El mensaje es obligatorio' });
    required(schema.robot, { message: 'Confirma que no eres un robot' });
  });

  guardar(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.contactoFormulario().invalid()) {
      return;
    }

    console.log(this.contactoModelo()); // más adelante se enviará al backend
    this.mensajeEnviado.set(true);
  }
}
