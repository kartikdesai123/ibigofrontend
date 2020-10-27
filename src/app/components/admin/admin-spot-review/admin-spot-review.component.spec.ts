import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpotReviewComponent } from './admin-spot-review.component';

describe('AdminSpotReviewComponent', () => {
  let component: AdminSpotReviewComponent;
  let fixture: ComponentFixture<AdminSpotReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSpotReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpotReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
