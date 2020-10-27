import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeopleReviewComponent } from './admin-people-review.component';

describe('AdminPeopleReviewComponent', () => {
  let component: AdminPeopleReviewComponent;
  let fixture: ComponentFixture<AdminPeopleReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPeopleReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPeopleReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
