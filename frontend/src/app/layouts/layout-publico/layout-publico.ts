import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { BotonWhatsapp } from '../boton-whatsapp/boton-whatsapp';

@Component({
  imports: [Header, RouterOutlet, Footer, BotonWhatsapp],
  selector: 'app-layout-publico',
  styleUrl: './layout-publico.css',
  templateUrl: './layout-publico.html',
})
export class LayoutPublico {}
