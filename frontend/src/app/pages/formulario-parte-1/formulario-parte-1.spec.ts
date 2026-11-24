import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { FormularioParte1 } from './formulario-parte-1';

describe('FormularioParte1', () => {
  let component: FormularioParte1;
  let fixture: ComponentFixture<FormularioParte1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioParte1],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioParte1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
