import { TestBed } from '@angular/core/testing';
import { SolicitudFormulario } from './solicitud-formulario';

describe('SolicitudFormulario', () => {
  let service: SolicitudFormulario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudFormulario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
