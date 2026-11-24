import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutInicioSesion } from './layout-inicio-sesion';

describe('LayoutInicioSesion', () => {
  let component: LayoutInicioSesion;
  let fixture: ComponentFixture<LayoutInicioSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutInicioSesion],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutInicioSesion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
