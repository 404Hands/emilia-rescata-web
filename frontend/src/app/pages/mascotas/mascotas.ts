import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Mascota } from '../../interfaces/mascota';
import { MascotaService } from '../../services/mascota';
import { mensajeDeError } from '../../services/http-error';

@Component({
  imports: [RouterLink],
  selector: 'app-mascotas',
  styleUrl: './mascotas.css',
  templateUrl: './mascotas.html',
})
export class Mascotas implements OnInit {
  readonly mascotaService = inject(MascotaService);
  readonly verMas = signal(false);
  readonly error = signal('');

  readonly visibles = computed(() => {
    const mascotas = this.mascotaService.mascotas();

    return this.verMas() ? mascotas : mascotas.slice(0, 16);
  });

  ngOnInit(): void {
    this.mascotaService.cargar().subscribe({
      next: () => {
        this.error.set('');
      },
      error: error => {
        this.error.set(mensajeDeError(error));
      },
    });
  }

  foto(mascota: Mascota): string {
    return mascota.fotos?.[0]
      ? this.mascotaService.urlFoto(mascota.id)
      : 'assets/perrito-referencia.png';
  }
}
