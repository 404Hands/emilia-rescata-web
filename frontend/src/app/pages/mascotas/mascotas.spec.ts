import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Mascotas } from './mascotas';
import { environment } from '../../../environments/environment';

describe('Mascotas', () => {
  let component: Mascotas;
  let fixture: ComponentFixture<Mascotas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mascotas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Mascotas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra en la tarjeta todos los datos devueltos por el catálogo', async () => {
    const http = TestBed.inject(HttpTestingController);
    const url = `${environment.apiUrl}/mascotas`;
    http.expectOne(url).flush([{
      id: 1,
      nombre: 'Luna',
      edad: 2,
      raza: 'Mestiza',
      especie: 'Gato',
      sexo: 'hembra',
      tamano: 'pequeno',
      historia: 'Rescatada en Lima',
      vacunado: true,
      desparasitado: false,
      esterilizado: true,
      rasgos: { amigable: true, jugueton: true },
      fotos: { 0: '/mascotas/1/fotos/0', 1: '/mascotas/1/fotos/1' },
    }]);
    await fixture.whenStable();

    const tarjeta = fixture.nativeElement.querySelector('.tarjeta');
    expect(tarjeta.textContent).toMatch(/Luna.*2 años/s);
    expect(tarjeta.textContent).toContain('Mestiza');
    expect(tarjeta.textContent).toContain('Gato');
    expect(tarjeta.textContent).toContain('Hembra');
    expect(tarjeta.textContent).toContain('Pequeño');
    expect(tarjeta.textContent).toContain('Amigable, Juguetón');
    expect(tarjeta.textContent).toContain('Rescatada en Lima');
    expect(tarjeta.textContent).toContain('Vacunado Sí');
    expect(tarjeta.textContent).toContain('Desparasitado No');
    expect(tarjeta.textContent).toContain('Esterilizado Sí');
    expect(tarjeta.querySelector('img').src).toBe(`${url}/1/fotos/0`);
    expect(tarjeta.querySelector('.datos-mascota a').href).toBe(`${url}/1/fotos/1`);
    http.verify();
  });
});
