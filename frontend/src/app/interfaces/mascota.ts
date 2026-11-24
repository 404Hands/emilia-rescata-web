export type SexoMascota = '' | 'macho' | 'hembra';
export type TamanoMascota = '' | 'pequeno' | 'mediano' | 'grande';

export interface RasgosMascota {
  amigable: boolean;
  jugueton: boolean;
  timido: boolean;
  carinoso: boolean;
  protector: boolean;
  obediente: boolean;
  tranquilo: boolean;
  inteligente: boolean;
}

export interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  especie: string;
  edad: number;
  sexo: SexoMascota;
  tamano: TamanoMascota;
  historia: string;

  vacunado: boolean;
  desparasitado: boolean;
  esterilizado: boolean;

  rasgos: RasgosMascota;
  fotos: Record<number, string>;
}

/** Ficha editable en el formulario; la edad puede quedar vacía. */
export type MascotaFormulario = Omit<Mascota, 'id' | 'fotos' | 'edad'> & {
  edad: number | null;
};

/** Datos que recibe el backend al registrar o editar una mascota. */
export type MascotaCreacion = Omit<Mascota, 'id' | 'fotos'>;
export type MascotaActualizacion = MascotaCreacion;
