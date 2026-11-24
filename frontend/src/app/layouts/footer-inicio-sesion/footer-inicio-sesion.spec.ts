import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterInicioSesion } from './footer-inicio-sesion';

describe('FooterInicioSesion', () => {
  let component: FooterInicioSesion;
  let fixture: ComponentFixture<FooterInicioSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterInicioSesion],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterInicioSesion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
