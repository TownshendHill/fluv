import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseSittingComponent } from './house-sitting.component';

describe('HouseSittingComponent', () => {
  let component: HouseSittingComponent;
  let fixture: ComponentFixture<HouseSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseSittingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
