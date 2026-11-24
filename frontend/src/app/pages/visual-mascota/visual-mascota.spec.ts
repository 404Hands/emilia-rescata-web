import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VisualMascota } from './visual-mascota';

describe('VisualMascota', () => {
  let component: VisualMascota;
  let fixture: ComponentFixture<VisualMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualMascota],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
