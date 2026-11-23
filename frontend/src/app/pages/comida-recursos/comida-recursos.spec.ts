import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComidaRecursos } from './comida-recursos';

describe('ComidaRecursos', () => {
  let component: ComidaRecursos;
  let fixture: ComponentFixture<ComidaRecursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComidaRecursos],
    }).compileComponents();

    fixture = TestBed.createComponent(ComidaRecursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
