import { Service, signal } from '@angular/core';
import { SolicitudFormulario } from '../interfaces/solicitud-formulario';

const solicitudVacia: SolicitudFormulario = {
  nombre: '',
  celular: '',
  distrito: '',
  tipoVivienda: '',
  propiedadVivienda: '',
  hayNinos: '',
  otrasMascotas: '',
  motivo: '',
  tiempoDisponible: '',
  compromiso: false,
};

@Service()
export class SolicitudFormularioService {

  datos = signal<SolicitudFormulario>({ ...solicitudVacia });

  guardarPaso(datos: SolicitudFormulario) {
    this.datos.set({ ...datos });
  }

  reiniciar() {
    this.datos.set({ ...solicitudVacia });
  }

}