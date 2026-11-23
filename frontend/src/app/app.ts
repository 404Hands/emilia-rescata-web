import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Adopciones } from './pages/adopciones/adopciones';
import { Donaciones } from './pages/donaciones/donaciones';


@Component({
  imports: [RouterOutlet, Inicio, SobreNosotros, Adopciones, Donaciones],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
