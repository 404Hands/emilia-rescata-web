export interface Donacion {
  monto: number;
  metodoPago: 'BCP' | 'Banco de la Nación' | 'BBVA' | 'PayPal' | '';
  fecha: Date;
  estado: 'Pendiente' | 'Confirmada' | 'Rechazada';
}