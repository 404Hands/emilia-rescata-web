import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, FormField } from '@angular/forms/signals';

import {
  Inventario,
  ProductoId,
  UnidadIngreso,
} from '../../services/inventario';
import { mensajeDeError } from '../../services/http-error';

@Component({
  selector: 'app-comida-recursos',
  standalone: true,
  imports: [FormField, DecimalPipe],
  templateUrl: './comida-recursos.html',
  styleUrl: './comida-recursos.css',
})
export class ComidaRecursos implements OnInit {
  readonly inventario = inject(Inventario);
  readonly soloFaltantes = signal(false);
  readonly mensaje = signal('');
  readonly ocupado = signal(false);

  readonly ingreso = signal<{
    productoId: ProductoId;
    cantidad: number | null;
    unidad: UnidadIngreso;
  }>({
    productoId: 'adultos',
    cantidad: null,
    unidad: 'envase',
  });

  readonly formulario = form(this.ingreso);

  readonly productoElegido = computed(() =>
    this.inventario
      .productos()
      .find(producto => producto.id === this.ingreso().productoId)
  );

  readonly productosVisibles = computed(() =>
    this.soloFaltantes()
      ? this.inventario.faltantes()
      : this.inventario.productos()
  );

  ngOnInit(): void {
    this.inventario.cargar().subscribe({
      error: error => {
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }

  cambiarProducto(id: string): void {
    this.ingreso.update(datos => ({
      ...datos,
      productoId: id as ProductoId,
      unidad: 'envase',
    }));
    this.mensaje.set('');
  }

  verFaltantes(seccion: HTMLElement): void {
    this.soloFaltantes.set(true);
    seccion.scrollIntoView({ block: 'start' });
    seccion.focus({ preventScroll: true });
  }

  irAlIngreso(selector: HTMLSelectElement): void {
    selector.focus();
    selector.scrollIntoView({ block: 'center' });
  }

  guardarIngreso(evento: Event): void {
    evento.preventDefault();

    if (this.ocupado()) {
      return;
    }

    const producto = this.productoElegido();
    const { cantidad, unidad } = this.ingreso();

    if (!producto || cantidad === null || !Number.isFinite(cantidad) || cantidad <= 0) {
      this.mensaje.set('Ingresa una cantidad mayor que cero.');
      return;
    }

    if (unidad === 'envase' && !Number.isInteger(cantidad)) {
      this.mensaje.set(`Ingresa un número entero de ${producto.plural}.`);
      return;
    }

    if (unidad === 'kg' && !producto.kgPorUnidad) {
      this.mensaje.set(`Este producto se registra en ${producto.plural}.`);
      return;
    }

    this.ocupado.set(true);
    this.mensaje.set('');

    this.inventario.registrarIngreso(producto.id, cantidad, unidad).subscribe({
      next: () => {
        this.ocupado.set(false);

        const medida =
          unidad === 'kg'
            ? 'kg'
            : cantidad === 1
              ? producto.unidad
              : producto.plural;

        this.mensaje.set(
          `Ingreso registrado: ${cantidad} ${medida} de ${producto.nombre}.`
        );
        this.ingreso.update(datos => ({ ...datos, cantidad: null }));
      },
      error: error => {
        this.ocupado.set(false);
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }

  usarUno(id: ProductoId): void {
    if (this.ocupado()) {
      return;
    }

    this.ocupado.set(true);
    this.mensaje.set('');

    this.inventario.usarUno(id).subscribe({
      next: producto => {
        this.ocupado.set(false);
        this.mensaje.set(
          `Se usó 1 ${producto.unidad} de ${producto.nombre}.`
        );
      },
      error: error => {
        this.ocupado.set(false);
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }

  agregarUnaUnidad(id: ProductoId): void {
    if (this.ocupado()) {
      return;
    }

    this.ocupado.set(true);
    this.mensaje.set('');

    this.inventario.registrarIngreso(id, 1, 'envase').subscribe({
      next: producto => {
        this.ocupado.set(false);
        this.mensaje.set(
          `Se agregó 1 ${producto.unidad} de ${producto.nombre}.`
        );
      },
      error: error => {
        this.ocupado.set(false);
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }
}
