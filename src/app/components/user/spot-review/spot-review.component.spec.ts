import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotReviewComponent } from './spot-review.component';

describe('SpotReviewComponent', () => {
  let component: SpotReviewComponent;
  let fixture: ComponentFixture<SpotReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
