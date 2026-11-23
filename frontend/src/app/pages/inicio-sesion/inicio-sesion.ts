import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { InicioSesionFormulario } from '../../interfaces/inicio-sesion-formulario';

@Component({
  imports: [FormField],
  selector: 'app-inicio-sesion',
  styleUrl: './inicio-sesion.css',
  templateUrl: './inicio-sesion.html',
})
export class InicioSesion {
  mostrarClave = false;


  intentoEnvio = signal(false);

  inicioSesionModelo = signal<InicioSesionFormulario>({
    correo: '',
    clave: '',
    recordar: false,
  });

  inicioSesionFormulario = form(this.inicioSesionModelo, (schema) => {
    required(schema.correo, { message: 'El correo electrónico es obligatorio' });
    email(schema.correo, { message: 'Ingrese un correo electrónico válido' });
    required(schema.clave, { message: 'La contraseña es obligatoria' });
  });

  ingresar(evento: Event) {
    evento.preventDefault();
    this.intentoEnvio.set(true);

    if (this.inicioSesionFormulario().invalid()) {
      return;
    }

    console.log(this.inicioSesionModelo()); 
  }
}
