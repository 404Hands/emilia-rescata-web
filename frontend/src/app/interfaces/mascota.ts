export interface Mascota {
  nombre: string;
  raza: string;
  edad: number | null;
  sexo: string;
  tamano: string;
  historia: string;

  vacunado: boolean;
  desparasitado: boolean;
  esterilizado: boolean;

  rasgos: {
    amigable: boolean;
    jugueton: boolean;
    timido: boolean;
    carinoso: boolean;
    protector: boolean;
    obediente: boolean;
    tranquilo: boolean;
    inteligente: boolean;
  };
}