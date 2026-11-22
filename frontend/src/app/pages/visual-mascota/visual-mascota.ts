import { Component, inject, OnDestroy, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';

import type { Mascota } from '../../interfaces/mascota';
import { Mascota as MascotaService } from '../../services/mascota';

interface FotoSeleccionada {
  archivo: File;
  vistaPrevia: string;
}

@Component({
  selector: 'app-visual-mascota',
  standalone: true,
  imports: [FormField],
  templateUrl: './visual-mascota.html',
  styleUrl: './visual-mascota.css'
})
export class VisualMascota implements OnDestroy {
  private readonly mascotaService = inject(MascotaService);

  readonly mascota = signal<Mascota>({
    nombre: '',
    raza: '',
    edad: null,
    sexo: '',
    tamano: '',
    historia: '',
    vacunado: false,
    desparasitado: false,
    esterilizado: false,
    rasgos: {
      amigable: false,
      jugueton: false,
      timido: false,
      carinoso: false,
      protector: false,
      obediente: false,
      tranquilo: false,
      inteligente: false
    }
  });

  readonly ficha = form(this.mascota, (campos) => {
    required(campos.nombre, {
      message: 'Escribe el nombre de la mascota.'
    });

    required(campos.raza, {
      message: 'Escribe la raza de la mascota.'
    });

    required(campos.edad, {
      message: 'Ingresa la edad de la mascota.'
    });

    min(campos.edad, 0, {
      message: 'La edad debe ser cero o mayor.'
    });
  });

  readonly mensaje = signal('');
  readonly fotoReferencia = 'assets/perrito-referencia.jpg';
  readonly posicionesExtra = [1, 2, 3] as const;

  // La posición 0 es la foto principal. Las posiciones 1 a 3 son las miniaturas.
  readonly fotos = signal<(FotoSeleccionada | null)[]>([
    null,
    null,
    null,
    null
  ]);

  seleccionarFoto(evento: Event, posicion: number): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      this.mensaje.set('Elige un archivo de imagen.');
      input.value = '';
      return;
    }

    const fotosActualizadas = [...this.fotos()];
    const fotoAnterior = fotosActualizadas[posicion];

    fotosActualizadas[posicion] = {
      archivo,
      vistaPrevia: URL.createObjectURL(archivo)
    };

    this.fotos.set(fotosActualizadas);
    this.mensaje.set('');

    if (fotoAnterior) {
      URL.revokeObjectURL(fotoAnterior.vistaPrevia);
    }
  }

  prepararPublicacion(evento: Event): void {
    evento.preventDefault();

    if (this.ficha().invalid()) {
      const campos = [
        this.ficha.nombre(),
        this.ficha.raza(),
        this.ficha.edad()
      ];

      const campoInvalido = campos.find(campo => campo.invalid());
      const error = campoInvalido?.errors()[0];

      this.mensaje.set(error?.message ?? 'Revisa los datos de la ficha.');
      return;
    }

    const fotosSeleccionadas = this.fotos();

    if (!fotosSeleccionadas[0]) {
      this.mensaje.set('Elige una foto principal para la mascota.');
      return;
    }

    const archivos = fotosSeleccionadas.map(foto => foto?.archivo ?? null);

    this.mascotaService.agregar(this.mascota(), archivos);
    this.mensaje.set('Mascota agregada a la lista.');
  }

  ngOnDestroy(): void {
    for (const foto of this.fotos()) {
      if (foto) {
        URL.revokeObjectURL(foto.vistaPrevia);
      }
    }
  }
}