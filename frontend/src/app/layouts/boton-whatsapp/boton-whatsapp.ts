import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-boton-whatsapp',
  styleUrl: './boton-whatsapp.css',
  templateUrl: './boton-whatsapp.html',
})
export class BotonWhatsapp {

  numero = '51955646940';
  mensaje = 'Hola, quiero información sobre la adopción de un perrito';
  enlace = `https://wa.me/${this.numero}?text=${encodeURIComponent(this.mensaje)}`;

}
