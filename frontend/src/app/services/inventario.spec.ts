import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Inventario } from './inventario';

describe('Inventario', () => {
  let service: Inventario;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Inventario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
