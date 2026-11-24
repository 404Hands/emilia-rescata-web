import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { FormularioParte3 } from './formulario-parte-3';

describe('FormularioParte3', () => {
  let component: FormularioParte3;
  let fixture: ComponentFixture<FormularioParte3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioParte3],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioParte3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
