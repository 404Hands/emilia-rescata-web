import { Component, inject, OnDestroy, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';

import type {
  MascotaCreacion,
  MascotaFormulario,
} from '../../interfaces/mascota';
import { MascotaService } from '../../services/mascota';
import { mensajeDeError } from '../../services/http-error';

interface FotoSeleccionada {
  archivo: File;
  vistaPrevia: string;
}

function mascotaVacia(): MascotaFormulario {
  return {
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
      inteligente: false,
    },
  };
}

@Component({
  selector: 'app-visual-mascota',
  standalone: true,
  imports: [FormField],
  templateUrl: './visual-mascota.html',
  styleUrl: './visual-mascota.css',
})
export class VisualMascota implements OnDestroy {
  private readonly mascotaService = inject(MascotaService);

  readonly mascota = signal<MascotaFormulario>(mascotaVacia());

  readonly ficha = form(this.mascota, campos => {
    required(campos.nombre, {
      message: 'Escribe el nombre de la mascota.',
    });

    required(campos.raza, {
      message: 'Escribe la raza de la mascota.',
    });

    required(campos.edad, {
      message: 'Ingresa la edad de la mascota.',
    });

    min(campos.edad, 0, {
      message: 'La edad debe ser cero o mayor.',
    });
  });

  readonly mensaje = signal('');
  readonly enviando = signal(false);
  readonly fotoReferencia = 'assets/perrito-referencia.png';
  readonly posicionesExtra = [1, 2, 3] as const;

  readonly fotos = signal<(FotoSeleccionada | null)[]>([
    null,
    null,
    null,
    null,
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
      vistaPrevia: URL.createObjectURL(archivo),
    };

    this.fotos.set(fotosActualizadas);
    this.mensaje.set('');

    if (fotoAnterior) {
      URL.revokeObjectURL(fotoAnterior.vistaPrevia);
    }
  }

  prepararPublicacion(evento: Event): void {
    evento.preventDefault();

    if (this.enviando()) {
      return;
    }

    if (this.ficha().invalid()) {
      const campos = [
        this.ficha.nombre(),
        this.ficha.raza(),
        this.ficha.edad(),
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

    const archivos = fotosSeleccionadas.map(
      foto => foto?.archivo ?? null
    );

    const { edad, ...resto } = this.mascota();
    const ficha: MascotaCreacion = { ...resto, edad: edad ?? 0 };

    this.enviando.set(true);
    this.mensaje.set('');

    this.mascotaService.crear(ficha, archivos).subscribe({
      next: () => {
        this.enviando.set(false);
        this.mensaje.set(
          `La mascota "${ficha.nombre}" se publicó correctamente.`
        );
        this.limpiarFormulario();
      },
      error: error => {
        this.enviando.set(false);
        this.mensaje.set(mensajeDeError(error));
      },
    });
  }

  ngOnDestroy(): void {
    this.revocarFotos();
  }

  private limpiarFormulario(): void {
    this.revocarFotos();
    this.fotos.set([null, null, null, null]);
    this.mascota.set(mascotaVacia());
  }

  private revocarFotos(): void {
    for (const foto of this.fotos()) {
      if (foto) {
        URL.revokeObjectURL(foto.vistaPrevia);
      }
    }
  }
}
