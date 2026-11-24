import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface UsuarioAdmin {
  nombre: string;
  rol: string;
  fotoUrl?: string;
}

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css'
})
export class HeaderAdmin {
  readonly usuario = input<UsuarioAdmin | null>(null);
  readonly salidaSolicitada = output<void>();
}
