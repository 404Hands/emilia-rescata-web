import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SolicitudFormularioService } from './solicitud-formulario';

describe('SolicitudFormularioService', () => {
  let service: SolicitudFormularioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SolicitudFormularioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
