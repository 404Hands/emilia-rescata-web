import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DonacionNueva, MetodoPago } from '../../interfaces/donacion';
import { DonacionService } from '../../services/donacion';
import { mensajeDeError } from '../../services/http-error';

@Component({
  selector: 'app-datos-donacion',
  imports: [RouterLink],
  templateUrl: './datos-donacion.html',
  styleUrl: './datos-donacion.css',
})
export class DatosDonacion {
  private readonly donacionService = inject(DonacionService);

  readonly nombre = signal('');
  readonly apellidos = signal('');
  readonly correo = signal('');
  readonly telefono = signal('');
  readonly direccion = signal('');
  readonly ciudad = signal('');
  readonly provincia = signal('');
  readonly codigoPostal = signal('');

  readonly numeroTarjeta = signal('');
  readonly titularTarjeta = signal('');
  readonly fechaVencimiento = signal('');
  readonly cvv = signal('');
  readonly correoPayPal = signal('');

  readonly metodoSeleccionado = signal<MetodoPago | ''>('');
  readonly erroresTarjeta = signal({
    numero: '',
    titular: '',
    fecha: '',
    cvv: '',
  });

  readonly donacionExitosa = signal(false);
  readonly enviando = signal(false);

  readonly mensaje = signal('');
  readonly tipoMensaje = signal<'error' | 'info'>('error');

  readonly metodos: MetodoPago[] = [
    'BCP',
    'Banco de la Nación',
    'BBVA',
    'PayPal',
  ];

  constructor() {
    const metodo = this.donacionService.donacionEnCurso().metodoPago;

    if (metodo) {
      this.metodoSeleccionado.set(metodo);
    }
  }

  monto(): number {
    return this.donacionService.donacionEnCurso().monto;
  }

  metodoPago(): MetodoPago | '' {
    return this.metodoSeleccionado();
  }

  esTarjeta(): boolean {
    return this.metodoPago() !== 'PayPal' && this.metodoPago() !== '';
  }

  actualizarCampo(campo: string, event: Event): void {
    const valor = (event.target as HTMLInputElement).value;

    switch (campo) {
      case 'nombre':
        this.nombre.set(valor);
        break;
      case 'apellidos':
        this.apellidos.set(valor);
        break;
      case 'correo':
        this.correo.set(valor);
        break;
      case 'telefono':
        this.telefono.set(valor);
        break;
      case 'direccion':
        this.direccion.set(valor);
        break;
      case 'ciudad':
        this.ciudad.set(valor);
        break;
      case 'provincia':
        this.provincia.set(valor);
        break;
      case 'codigoPostal':
        this.codigoPostal.set(valor);
        break;
    }

    this.mensaje.set('');
  }

  actualizarTarjeta(
    campo: 'numero' | 'titular' | 'fecha' | 'cvv',
    event: Event
  ): void {
    const valor = (event.target as HTMLInputElement).value;

    switch (campo) {
      case 'numero':
        this.numeroTarjeta.set(valor);
        break;
      case 'titular':
        this.titularTarjeta.set(valor);
        break;
      case 'fecha':
        this.fechaVencimiento.set(valor);
        break;
      case 'cvv':
        this.cvv.set(valor);
        break;
    }

    this.erroresTarjeta.update(errores => ({ ...errores, [campo]: '' }));
    this.mensaje.set('');
  }

  actualizarCorreoPayPal(event: Event): void {
    this.correoPayPal.set((event.target as HTMLInputElement).value);
    this.mensaje.set('');
  }

  seleccionarMetodo(metodo: MetodoPago): void {
    this.metodoSeleccionado.set(metodo);
    this.donacionService.actualizarMetodoPago(metodo);

    this.numeroTarjeta.set('');
    this.titularTarjeta.set('');
    this.fechaVencimiento.set('');
    this.cvv.set('');
    this.correoPayPal.set('');
    this.erroresTarjeta.set({ numero: '', titular: '', fecha: '', cvv: '' });

    this.mensaje.set('');
  }

  confirmarDonacion(): void {
    if (this.enviando()) {
      return;
    }

    if (this.monto() < 1) {
      this.mostrarError(
        'Selecciona un monto válido antes de completar la donación.'
      );
      return;
    }

    if (
      !this.nombre().trim() ||
      !this.apellidos().trim() ||
      !this.correo().trim() ||
      !this.telefono().trim() ||
      !this.direccion().trim() ||
      !this.ciudad().trim() ||
      !this.provincia().trim()
    ) {
      this.mostrarError(
        'Completa todos tus datos de facturación para continuar.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo())) {
      this.mostrarError('Ingresa un correo electrónico válido.');
      return;
    }

    const metodoPago = this.metodoPago();

    if (!metodoPago) {
      this.mostrarError('Selecciona un método de pago.');
      return;
    }

    if (metodoPago === 'PayPal') {
      if (
        !this.correoPayPal().trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoPayPal())
      ) {
        this.mostrarError('Ingresa un correo válido de PayPal.');
        return;
      }
    } else if (!this.validarTarjeta()) {
      this.mostrarError('Revisa los datos de la tarjeta marcados en rojo.');
      return;
    }

    const donacion: DonacionNueva = {
      monto: this.monto(),
      metodoPago,
      nombre: this.nombre().trim(),
      apellidos: this.apellidos().trim(),
      correo: this.correo().trim(),
      telefono: this.telefono().trim(),
      direccion: this.direccion().trim(),
      ciudad: this.ciudad().trim(),
      provincia: this.provincia().trim(),
      codigoPostal: this.codigoPostal().trim(),
    };

    this.mensaje.set('');
    this.enviando.set(true);

    this.donacionService.guardarDonacion(donacion).subscribe({
      next: () => {
        this.enviando.set(false);
        this.donacionExitosa.set(true);
      },
      error: error => {
        this.enviando.set(false);
        this.mostrarError(mensajeDeError(error));
      },
    });
  }

  private validarTarjeta(): boolean {
    const numero = this.numeroTarjeta().replace(/\s/g, '');
    const errores = { numero: '', titular: '', fecha: '', cvv: '' };

    if (!numero) {
      errores.numero = 'Escribe el número de tu tarjeta.';
    } else if (!/^\d+$/.test(numero)) {
      errores.numero = 'El número solo debe tener dígitos.';
    } else if (numero.length < 13 || numero.length > 19) {
      errores.numero = 'El número debe tener entre 13 y 19 dígitos.';
    }

    if (!this.titularTarjeta().trim()) {
      errores.titular = 'Escribe el nombre del titular.';
    }

    if (!this.fechaVencimiento().trim()) {
      errores.fecha = 'Escribe la fecha de vencimiento.';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.fechaVencimiento())) {
      errores.fecha = 'Usa el formato MM/AA, por ejemplo 08/28.';
    }

    if (!this.cvv().trim()) {
      errores.cvv = 'Escribe el CVV.';
    } else if (!/^\d{3,4}$/.test(this.cvv())) {
      errores.cvv = 'El CVV debe tener 3 o 4 dígitos.';
    }

    this.erroresTarjeta.set(errores);
    return !Object.values(errores).some(error => error);
  }

  private mostrarError(mensaje: string): void {
    this.tipoMensaje.set('error');
    this.mensaje.set(mensaje);
  }
}
