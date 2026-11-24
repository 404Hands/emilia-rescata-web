import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

export type ProductoId =
  | 'adultos'
  | 'cachorros'
  | 'especial'
  | 'latas'
  | 'desinfectante';
export type UnidadIngreso = 'envase' | 'kg';

export interface Producto {
  id: ProductoId;
  nombre: string;
  cantidad: number;
  unidad: string;
  plural: string;
  kgPorUnidad: number | null;
  minimo: number;
  detalle: string;
}

export interface Ingreso {
  ingreso_id: number;
  productoId: ProductoId;
  cantidad: number;
  unidad: UnidadIngreso;
}

export interface ProductoConIngreso extends Producto {
  ingreso_id: number;
}

/** Producto con el icono que usa la vista del inventario. */
export interface ProductoVista extends Producto {
  icono: string;
}

const ICONOS: Record<ProductoId, string> = {
  adultos: 'huella',
  cachorros: 'cachorro',
  especial: 'salud',
  latas: 'lata',
  desinfectante: 'desinfectante',
};

@Service()
export class Inventario {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/recursos`;

  readonly perros = 28;
  private readonly consumoDiarioKg = 23;

  private readonly existencias = signal<ProductoVista[]>([]);
  readonly productos = this.existencias.asReadonly();

  readonly cargando = signal(false);

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

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url).pipe(
      tap(productos => {
        this.existencias.set(productos.map(producto => this.mapear(producto)));
      })
    );
  }

  cargar(): Observable<Producto[]> {
    this.cargando.set(true);

    return this.listar().pipe(finalize(() => this.cargando.set(false)));
  }

  registrarIngreso(
    productoId: ProductoId,
    cantidad: number,
    unidad: UnidadIngreso
  ): Observable<ProductoConIngreso> {
    return this.http
      .post<ProductoConIngreso>(`${this.url}/ingresos`, {
        productoId,
        cantidad,
        unidad,
      })
      .pipe(
        tap(producto => {
          this.actualizarProducto(producto);
        })
      );
  }

  usarUno(productoId: ProductoId): Observable<Producto> {
    return this.http
      .post<Producto>(`${this.url}/${productoId}/consumos`, {})
      .pipe(
        tap(producto => {
          this.actualizarProducto(producto);
        })
      );
  }

  listarIngresos(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.url}/ingresos`);
  }

  editarIngreso(
    ingresoId: number,
    productoId: ProductoId,
    cantidad: number,
    unidad: UnidadIngreso
  ): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.url}/ingresos/${ingresoId}`, {
      productoId,
      cantidad,
      unidad,
    });
  }

  eliminarIngreso(ingresoId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/ingresos/${ingresoId}`);
  }

  private actualizarProducto(producto: Producto): void {
    this.existencias.update(productos =>
      productos.map(item =>
        item.id === producto.id ? this.mapear(producto) : item
      )
    );
  }

  private mapear(producto: Producto): ProductoVista {
    return {
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      unidad: producto.unidad,
      plural: producto.plural,
      kgPorUnidad: producto.kgPorUnidad,
      minimo: producto.minimo,
      detalle: producto.detalle,
      icono: ICONOS[producto.id] ?? 'huella',
    };
  }
}
