import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutAdministrar } from './layout-administrar';

describe('LayoutAdministrar', () => {
  let component: LayoutAdministrar;
  let fixture: ComponentFixture<LayoutAdministrar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutAdministrar],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutAdministrar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
