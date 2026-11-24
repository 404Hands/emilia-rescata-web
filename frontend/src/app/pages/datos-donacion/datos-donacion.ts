import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Donacion } from '../../interfaces/donacion';
import { DonacionService } from '../../services/donacion';

@Component({
  selector: 'app-datos-donacion',
  imports: [RouterLink],
  templateUrl: './datos-donacion.html',
  styleUrl: './datos-donacion.css'
})
export class DatosDonacion {
  modelo: ReturnType<DonacionService['mostrarDonaciones']>;

  nombre = signal('');
  apellidos = signal('');
  correo = signal('');
  telefono = signal('');
  direccion = signal('');
  ciudad = signal('');
  provincia = signal('');
  codigoPostal = signal('');

  numeroTarjeta = signal('');
  titularTarjeta = signal('');
  fechaVencimiento = signal('');
  cvv = signal('');
  correoPayPal = signal('');

  metodoSeleccionado = signal<Donacion['metodoPago']>('');

  erroresTarjeta = signal({ numero: '', titular: '', fecha: '', cvv: '' });

  donacionExitosa = signal(false);

  mensaje = signal('');
  tipoMensaje = signal<'error' | 'info'>('error');

  metodos: Donacion['metodoPago'][] = [
    'BCP',
    'Banco de la Nación',
    'BBVA',
    'PayPal'
  ];

  constructor(private donacionService: DonacionService) {
    this.modelo = this.donacionService.mostrarDonaciones();

    const donaciones = this.modelo();
    if (donaciones.length > 0) {
      this.metodoSeleccionado.set(donaciones[donaciones.length - 1].metodoPago);
    }
  }

  monto(): number {
    const donaciones = this.modelo();

    return donaciones.length > 0
      ? donaciones[donaciones.length - 1].monto
      : 0;
  }

  metodoPago(): Donacion['metodoPago'] {
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

    this.erroresTarjeta.update(e => ({ ...e, [campo]: '' }));
    this.mensaje.set('');
  }

  actualizarCorreoPayPal(event: Event): void {
    this.correoPayPal.set(
      (event.target as HTMLInputElement).value
    );

    this.mensaje.set('');
  }

  seleccionarMetodo(metodo: Donacion['metodoPago']): void {
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

    if (!this.metodoPago()) {
      this.mostrarError('Selecciona un método de pago.');
      return;
    }

    if (this.metodoPago() === 'PayPal') {
      if (
        !this.correoPayPal().trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoPayPal())
      ) {
        this.mostrarError('Ingresa un correo válido de PayPal.');
        return;
      }
    } else {
      if (!this.validarTarjeta()) {
        this.mostrarError('Revisa los datos de la tarjeta marcados en rojo.');
        return;
      }
    }

    this.mensaje.set('');
    this.donacionExitosa.set(true);
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
    return !Object.values(errores).some(e => e);
  }

  private mostrarError(mensaje: string): void {
    this.tipoMensaje.set('error');
    this.mensaje.set(mensaje);
  }
}