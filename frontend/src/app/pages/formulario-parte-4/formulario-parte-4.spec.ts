import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioParte4 } from './formulario-parte-4';

describe('FormularioParte4', () => {
  let component: FormularioParte4;
  let fixture: ComponentFixture<FormularioParte4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioParte4],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioParte4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
