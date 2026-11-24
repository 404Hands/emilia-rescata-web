import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Donacion } from '../../interfaces/donacion';
import { DonacionService } from '../../services/donacion';

@Component({
  selector: 'app-proceso-donacion',
  imports: [RouterLink],
  templateUrl: './proceso-donacion.html',
  styleUrl: './proceso-donacion.css'
})
export class ProcesoDonacion {

  constructor(private donacionService: DonacionService) {}

  modelo = signal<Donacion>({
    monto: 0,
    metodoPago: '',
    fecha: new Date(),
    estado: 'Pendiente'
  });

  otroMonto = signal(false);
  mensaje = signal('');

  montos = [10, 20, 30, 50, 100, 150];

  seleccionarMonto(monto: number) {
    this.modelo.update(d => ({ ...d, monto }));
    this.otroMonto.set(false);
    this.mensaje.set('');
  }

  seleccionarOtro() {
    this.modelo.update(d => ({ ...d, monto: 0 }));
    this.otroMonto.set(true);
    this.mensaje.set('');
  }

  actualizarMonto(event: Event) {
    const valor = Number((event.target as HTMLInputElement).value);

    this.modelo.update(d => ({ ...d, monto: valor }));
    this.mensaje.set('');
  }

  montoValido(): boolean {
    return this.modelo().monto >= 1 &&
      Number.isFinite(this.modelo().monto);
  }

  guardarMonto() {
    if (!this.montoValido()) {
      this.mensaje.set('Por favor, selecciona o ingresa un monto válido para continuar.');
      return;
    }

    this.donacionService.guardarDonacion(this.modelo());
    this.mensaje.set('');
  }
}