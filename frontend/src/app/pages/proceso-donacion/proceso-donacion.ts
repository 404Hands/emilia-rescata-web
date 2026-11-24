import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DonacionService } from '../../services/donacion';

@Component({
  selector: 'app-proceso-donacion',
  imports: [RouterLink],
  templateUrl: './proceso-donacion.html',
  styleUrl: './proceso-donacion.css',
})
export class ProcesoDonacion {
  private readonly donacionService = inject(DonacionService);

  readonly borrador = this.donacionService.donacionEnCurso;
  readonly montos = [10, 20, 30, 50, 100, 150];
  readonly mensaje = signal('');
  readonly otroMonto = signal(
    this.borrador().monto > 0 && !this.montos.includes(this.borrador().monto)
  );

  monto(): number {
    return this.borrador().monto;
  }

  seleccionarMonto(monto: number): void {
    this.donacionService.establecerMonto(monto);
    this.otroMonto.set(false);
    this.mensaje.set('');
  }

  seleccionarOtro(): void {
    this.donacionService.establecerMonto(0);
    this.otroMonto.set(true);
    this.mensaje.set('');
  }

  actualizarMonto(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);

    this.donacionService.establecerMonto(valor);
    this.mensaje.set('');
  }

  montoValido(): boolean {
    return this.monto() >= 1 && Number.isFinite(this.monto());
  }

  guardarMonto(): void {
    if (!this.montoValido()) {
      this.mensaje.set(
        'Por favor, selecciona o ingresa un monto válido para continuar.'
      );
      return;
    }

    this.mensaje.set('');
  }
}
