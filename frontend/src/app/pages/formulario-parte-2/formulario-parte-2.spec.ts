import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { FormularioParte2 } from './formulario-parte-2';

describe('FormularioParte2', () => {
  let component: FormularioParte2;
  let fixture: ComponentFixture<FormularioParte2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioParte2],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioParte2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
