import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

import { InicioSesionFormulario } from '../../interfaces/inicio-sesion-formulario';
import { AutenticacionService } from '../../services/autenticacion';
import { mensajeDeError } from '../../services/http-error';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-inicio-sesion',
  styleUrl: './inicio-sesion.css',
  templateUrl: './inicio-sesion.html',
})
export class InicioSesion {
  private readonly router = inject(Router);
  private readonly autenticacion = inject(AutenticacionService);

  mostrarClave = false;
  intentoEnvio = signal(false);
  enviando = signal(false);
  errorServidor = signal('');

  inicioSesionModelo = signal<InicioSesionFormulario>({
    correo: '',
    clave: '',
    recordar: false,
  });

  inicioSesionFormulario = form(this.inicioSesionModelo, schema => {
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.clave, { message: 'La contraseña es obligatoria' });
  });

  ingresar(evento: Event): void {
    evento.preventDefault();
    this.intentoEnvio.set(true);
    this.errorServidor.set('');

    if (this.inicioSesionFormulario().invalid() || this.enviando()) {
      return;
    }

    this.enviando.set(true);

    this.autenticacion.iniciarSesion(this.inicioSesionModelo()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/admin/panel-general']);
      },
      error: error => {
        this.enviando.set(false);
        this.errorServidor.set(mensajeDeError(error));
      },
    });
  }
}
