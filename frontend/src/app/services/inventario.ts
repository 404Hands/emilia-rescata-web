import { computed, Injectable, signal } from '@angular/core';

export interface Producto {
  id: string;
  nombre: string;
  icono: string;
  cantidad: number;
  unidad: string;
  plural: string;
  kgPorUnidad: number | null;
  minimo: number;
  detalle: string;
}

@Injectable({ providedIn: 'root' })
export class Inventario {
  readonly perros = 28;
  private readonly consumoDiarioKg = 23;

  private readonly existencias = signal<Producto[]>([
    {
      id: 'adultos',
      nombre: 'Comida Perros Adultos',
      icono: '🐾',
      cantidad: 12,
      unidad: 'saco',
      plural: 'sacos',
      kgPorUnidad: 20,
      minimo: 3,
      detalle: 'Alimento para perros adultos'
    },
    {
      id: 'cachorros',
      nombre: 'Comida Cachorros (Puppy)',
      icono: '🐶',
      cantidad: 3,
      unidad: 'saco',
      plural: 'sacos',
      kgPorUnidad: 20,
      minimo: 3,
      detalle: 'Alimento para cachorros'
    },
    {
      id: 'especial',
      nombre: 'Comida Especial / Hipoalergénica',
      icono: '✚',
      cantidad: 5,
      unidad: 'saco',
      plural: 'sacos',
      kgPorUnidad: 24,
      minimo: 2,
      detalle: 'Para perritos con dieta delicada'
    },
    {
      id: 'latas',
      nombre: 'Latas de Comida Húmeda / Paté',
      icono: '🥫',
      cantidad: 48,
      unidad: 'lata',
      plural: 'latas',
      kgPorUnidad: null,
      minimo: 10,
      detalle: 'Para premios y medicamentos'
    },
    {
      id: 'desinfectante',
      nombre: 'Desinfectante de Caniles',
      icono: '✧',
      cantidad: 2,
      unidad: 'bidón',
      plural: 'bidones',
      kgPorUnidad: null,
      minimo: 2,
      detalle: 'Para el lavado de patios'
    }
  ]);

  readonly productos = this.existencias.asReadonly();

  readonly totalKg = computed(() =>
    this.productos().reduce(
      (total, producto) =>
        total + producto.cantidad * (producto.kgPorUnidad ?? 0),
      0
    )
  );

  readonly diasDisponibles = computed(() =>
    Math.floor(this.totalKg() / this.consumoDiarioKg)
  );

  readonly faltantes = computed(() =>
    this.productos().filter(producto => producto.cantidad <= producto.minimo)
  );

  ajustar(id: string, cambio: number): void {
    if (!Number.isFinite(cambio)) return;

    this.existencias.update(productos =>
      productos.map(producto => {
        if (producto.id !== id) return producto;

        const cantidad = Math.max(0, producto.cantidad + cambio);
        return { ...producto, cantidad };
      })
    );
  }
}