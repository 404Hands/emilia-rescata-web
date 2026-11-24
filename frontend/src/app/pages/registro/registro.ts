import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  email,
  form,
  FormField,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';

import { RegistroFormulario } from '../../interfaces/registro-formulario';
import { AutenticacionService } from '../../services/autenticacion';
import { mensajeDeError } from '../../services/http-error';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private readonly autenticacion = inject(AutenticacionService);
  private readonly router = inject(Router);

  mostrarClave = false;
  intentoEnvio = signal(false);
  enviando = signal(false);
  errorServidor = signal('');

  registroModelo = signal<RegistroFormulario>({
    nombre: '',
    correo: '',
    clave: '',
    confirmarClave: '',
  });

  registroFormulario = form(this.registroModelo, schema => {
    required(schema.nombre, { message: 'El nombre es obligatorio' });
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.clave, { message: 'La contraseña es obligatoria' });
    minLength(schema.clave, 8, {
      message: 'La contraseña debe tener al menos 8 caracteres',
    });
    required(schema.confirmarClave, { message: 'Confirma tu contraseña' });
    validate(schema.confirmarClave, ({ value, valueOf }) => {
      if (value() !== valueOf(schema.clave)) {
        return {
          kind: 'clavesDistintas',
          message: 'Las contraseñas no coinciden',
        };
      }
      return null;
    });
  });

  registrar(evento: Event): void {
    evento.preventDefault();
    this.intentoEnvio.set(true);
    this.errorServidor.set('');

    if (this.registroFormulario().invalid() || this.enviando()) {
      return;
    }

    this.enviando.set(true);

    this.autenticacion.registrar(this.registroModelo()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/inicio-sesion']);
      },
      error: error => {
        this.enviando.set(false);
        this.errorServidor.set(mensajeDeError(error));
      },
    });
  }
}
