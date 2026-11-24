import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { RegistroFormulario } from '../../interfaces/registro-formulario';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  mostrarClave = false;
  intentoEnvio = signal(false);

  registroModelo = signal<RegistroFormulario>({
    nombre: '',
    correo: '',
    clave: '',
    confirmarClave: '',
  });

  registroFormulario = form(this.registroModelo, (schema) => {
    required(schema.nombre, { message: 'El nombre es obligatorio' });
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.clave, { message: 'La contraseña es obligatoria' });
    minLength(schema.clave, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });
    required(schema.confirmarClave, { message: 'Confirma tu contraseña' });
    validate(schema.confirmarClave, ({ value, valueOf }) => {
      if (value() !== valueOf(schema.clave)) {
        return { kind: 'clavesDistintas', message: 'Las contraseñas no coinciden' };
      }
      return null;
    });
  });

  registrar(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.registroFormulario().invalid()) {
      return;
    }

    console.log(this.registroModelo()); 
  }
}