import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Adopciones } from './pages/adopciones/adopciones';



import { Footer } from './layouts/footer/footer';
import { FooterInicioSesion } from './layouts/footer-inicio-sesion/footer-inicio-sesion';
import { Header } from './layouts/header/header';
import { HeaderInicioSesion } from './layouts/header-inicio-sesion/header-inicio-sesion';



import { Contacto } from './pages/contacto/contacto';
import { FormularioParte1 } from './pages/formulario-parte-1/formulario-parte-1';
import { FormularioParte2 } from './pages/formulario-parte-2/formulario-parte-2';
import { FormularioParte3 } from './pages/formulario-parte-3/formulario-parte-3';
import { FormularioParte4 } from './pages/formulario-parte-4/formulario-parte-4';
import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';
import { Mascotas } from './pages/mascotas/mascotas';





@Component({
  imports: [RouterOutlet, Footer, FooterInicioSesion, Header, HeaderInicioSesion, Contacto, FormularioParte1, FormularioParte2, FormularioParte3, FormularioParte4, InicioSesion, Mascotas],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
