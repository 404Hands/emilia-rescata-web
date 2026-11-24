import { Injectable, signal } from '@angular/core';
import { Donacion } from '../interfaces/donacion';

@Injectable({
  providedIn: 'root'
})
export class DonacionService {

  private donaciones = signal<Donacion[]>([]);

  guardarDonacion(donacion: Donacion) {
    this.donaciones.update(lista => [...lista, donacion]);
  }

  mostrarDonaciones() {
    return this.donaciones;
  }

  actualizarMetodoPago(metodo: Donacion['metodoPago']) {
    this.donaciones.update(lista => {
      if (lista.length === 0) {
        return lista;
      }

      const actualizadas = [...lista];
      const ultima = actualizadas.length - 1;

      actualizadas[ultima] = {
        ...actualizadas[ultima],
        metodoPago: metodo
      };

      return actualizadas;
    });
  }
}