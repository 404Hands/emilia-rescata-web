import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Donaciones } from './donaciones';

describe('Donaciones', () => {
  let component: Donaciones;
  let fixture: ComponentFixture<Donaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donaciones],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Donaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
