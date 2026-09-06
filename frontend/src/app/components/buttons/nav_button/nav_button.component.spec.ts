import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavButton } from './nav_button.component';

describe('NavButton Component', () => {
  let component: NavButton;
  let fixture: ComponentFixture<NavButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavButton],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
