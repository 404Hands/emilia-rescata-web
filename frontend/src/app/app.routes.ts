import { Routes } from '@angular/router';

import { LayoutPublico } from './layouts/layout-publico/layout-publico';
import { LayoutInicioSesion } from './layouts/layout-inicio-sesion/layout-inicio-sesion';

import { Contacto } from './pages/contacto/contacto';
import { Mascotas } from './pages/mascotas/mascotas';
import { InicioSesion } from './pages/inicio-sesion/inicio-sesion';
import { FormularioParte1 } from './pages/formulario-parte-1/formulario-parte-1';
import { FormularioParte2 } from './pages/formulario-parte-2/formulario-parte-2';
import { FormularioParte3 } from './pages/formulario-parte-3/formulario-parte-3';
import { FormularioParte4 } from './pages/formulario-parte-4/formulario-parte-4';
import { Inicio } from './pages/inicio/inicio';
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Adopciones } from './pages/adopciones/adopciones';
import { Donaciones } from './pages/donaciones/donaciones';
import { VisualMascota } from './pages/visual-mascota/visual-mascota';
import { LayoutAdministrar } from './layouts/layout-administrar/layout-administrar';
import { ComidaRecursos } from './pages/comida-recursos/comida-recursos';
import { Mascota } from './services/mascota';



export const routes: Routes = [

  {
    path: '',
    component: LayoutPublico,
    children: [
      { path: '', redirectTo: 'contacto', pathMatch: 'full' },
      { path: 'contacto', component: Contacto },
      { path: 'mascotas', component: Mascotas },
      { path: 'inicio', component:Inicio},
      { path: 'sobre-nosotros', component:SobreNosotros},
      { path: 'adopciones', component:Adopciones},
      { path: 'donaciones', component:Donaciones}
    ]
  },


  {
    path: '',
    component: LayoutAdministrar,
    children: [
      {path: 'visual-mascota', component:VisualMascota},
      {path: 'comida-recursos', component:ComidaRecursos},
      {path: 'panel-general', component:VisualMascota},
      {path: 'admin/mascotas', component:Mascotas},
      {path: 'contacto', component:Contacto},
      {path:'mascotas', component:Mascota}
    ]
  },


  {
    path: 'inicio-sesion',
    component: LayoutInicioSesion,
    children: [
      { path: '', component: InicioSesion }
    ]
  },


  { path: 'formulario-parte-1', component: FormularioParte1 },
  { path: 'formulario-parte-2', component: FormularioParte2 },
  { path: 'formulario-parte-3', component: FormularioParte3 },
  { path: 'formulario-parte-4', component: FormularioParte4 },
];
