import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualMascota } from './visual-mascota';

describe('VisualMascota', () => {
  let component: VisualMascota;
  let fixture: ComponentFixture<VisualMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualMascota],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
