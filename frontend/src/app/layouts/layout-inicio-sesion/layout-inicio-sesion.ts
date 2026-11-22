import { Component } from '@angular/core';
import { HeaderInicioSesion } from '../header-inicio-sesion/header-inicio-sesion';
import { RouterOutlet } from '@angular/router';
import { FooterInicioSesion } from '../footer-inicio-sesion/footer-inicio-sesion';

@Component({
  imports: [HeaderInicioSesion, RouterOutlet, FooterInicioSesion],
  selector: 'app-layout-inicio-sesion',
  styleUrl: './layout-inicio-sesion.css',
  templateUrl: './layout-inicio-sesion.html',
})
export class LayoutInicioSesion {}
