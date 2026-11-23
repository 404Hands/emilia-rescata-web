import { Component } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  imports: [HeaderAdmin, RouterOutlet, RouterLink],
  selector: 'app-layout-administrar',
  styleUrl: './layout-administrar.css',
  templateUrl: './layout-administrar.html',
})
export class LayoutAdministrar {}
