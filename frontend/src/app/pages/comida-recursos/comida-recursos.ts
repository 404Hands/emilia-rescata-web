import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, FormField } from '@angular/forms/signals';
import { Inventario } from '../../services/inventario';

@Component({
  selector: 'app-comida-recursos',
  standalone: true,
  imports: [FormField, DecimalPipe],
  templateUrl: './comida-recursos.html',
  styleUrl: './comida-recursos.css'
})
export class ComidaRecursos {
  readonly inventario = inject(Inventario);
  readonly soloFaltantes = signal(false);
  readonly mensaje = signal('');

  readonly ingreso = signal({
    productoId: 'adultos',
    cantidad: null as number | null,
    unidad: 'envase'
  });

  readonly formulario = form(this.ingreso);

  readonly productoElegido = computed(() =>
    this.inventario.productos().find(p => p.id === this.ingreso().productoId)
  );

  readonly productosVisibles = computed(() =>
    this.soloFaltantes()
      ? this.inventario.faltantes()
      : this.inventario.productos()
  );

  cambiarProducto(id: string): void {
    this.ingreso.update(datos => ({
      ...datos,
      productoId: id,
      unidad: 'envase'
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

    let unidades = cantidad;

    if (unidad === 'kg') {
      if (!producto.kgPorUnidad) {
        this.mensaje.set(`Este producto se registra en ${producto.plural}.`);
        return;
      }
      unidades = cantidad / producto.kgPorUnidad;
    }

    this.inventario.ajustar(producto.id, unidades);

    const medida = unidad === 'kg'
      ? 'kg'
      : cantidad === 1 ? producto.unidad : producto.plural;

    this.mensaje.set(`Ingreso registrado: ${cantidad} ${medida} de ${producto.nombre}.`);
    this.ingreso.update(datos => ({ ...datos, cantidad: null }));
  }
}