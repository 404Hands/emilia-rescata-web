export type MetodoPago = 'BCP' | 'Banco de la Nación' | 'BBVA' | 'PayPal';
export type EstadoDonacion = 'Pendiente' | 'Confirmada' | 'Rechazada';

export interface DonacionNueva {
  monto: number;
  metodoPago: MetodoPago;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
}

export interface Donacion extends DonacionNueva {
  id: number;
  fecha: string;
  estado: EstadoDonacion;
}
