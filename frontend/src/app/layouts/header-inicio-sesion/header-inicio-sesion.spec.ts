import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderInicioSesion } from './header-inicio-sesion';

describe('HeaderInicioSesion', () => {
  let component: HeaderInicioSesion;
  let fixture: ComponentFixture<HeaderInicioSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInicioSesion],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderInicioSesion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
