import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderAdmin } from './header-admin';

describe('HeaderAdmin', () => {
  let component: HeaderAdmin;
  let fixture: ComponentFixture<HeaderAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAdmin],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
