import { Service, signal } from '@angular/core';
import type { Mascota as DatosMascota } from '../interfaces/mascota';

interface MascotaRegistrada extends DatosMascota {
  fotos: (File | null)[];
}

@Service()
export class Mascota {
  readonly mascotas = signal<MascotaRegistrada[]>([]);

  agregar(datos: DatosMascota, fotos: (File | null)[]): void {
    const registro: MascotaRegistrada = { ...datos, fotos };

    this.mascotas.update(lista => [...lista, registro]);
  }
}