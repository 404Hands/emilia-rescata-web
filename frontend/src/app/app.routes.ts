
import { Routes } from '@angular/router';

import { LayoutPublico } from './layouts/layout-publico/layout-publico';
import { LayoutInicioSesion } from './layouts/layout-inicio-sesion/layout-inicio-sesion';

import { Inicio } from './pages/inicio/inicio';
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Adopciones } from './pages/adopciones/adopciones';
import { Donaciones } from './pages/donaciones/donaciones';
import { Contacto } from './pages/contacto/contacto';
import { Mascotas } from './pages/mascotas/mascotas';

import { ProcesoDonacion } from './pages/proceso-donacion/proceso-donacion';
import { DatosDonacion } from './pages/datos-donacion/datos-donacion';

import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';
import { FormularioParte1 } from './pages/formulario-parte-1/formulario-parte-1';
import { FormularioParte2 } from './pages/formulario-parte-2/formulario-parte-2';
import { FormularioParte3 } from './pages/formulario-parte-3/formulario-parte-3';
import { FormularioParte4 } from './pages/formulario-parte-4/formulario-parte-4';

import { VisualMascota } from './pages/visual-mascota/visual-mascota';
import { LayoutAdministrar } from './layouts/layout-administrar/layout-administrar';
import { ComidaRecursos } from './pages/comida-recursos/comida-recursos';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublico,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
      { path: 'sobre-nosotros', component: SobreNosotros },
      { path: 'adopciones', component: Adopciones },
      { path: 'donaciones', component: Donaciones },
      { path: 'proceso-donacion', component: ProcesoDonacion },
      { path: 'datos-donacion', component: DatosDonacion },
      { path: 'contacto', component: Contacto },
      { path: 'mascotas', component: Mascotas }
    ]
  },


  {
    path: '',
    component: LayoutAdministrar,
    children: [
      {path: 'admin/comida-recursos', component:ComidaRecursos},
      {path: 'admin/panel-general', component:VisualMascota},
      {path: 'admin/mascotas', component:Mascotas},
    ]
  },


  {
    path: 'inicio-sesion',
    component: LayoutInicioSesion,
    children: [
      { path: '', component: InicioSesion }
    ]
  },

  {
    path: 'registro',
    component: LayoutInicioSesion,
    children: [
      { path: '', component: Registro }
    ]
  },

  { path: 'formulario-parte-1', component: FormularioParte1 },
  { path: 'formulario-parte-2', component: FormularioParte2 },
  { path: 'formulario-parte-3', component: FormularioParte3 },
  { path: 'formulario-parte-4', component: FormularioParte4 },
];
