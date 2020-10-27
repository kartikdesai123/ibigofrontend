import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInPostComponent } from './check-in-post.component';

describe('CheckInPostComponent', () => {
  let component: CheckInPostComponent;
  let fixture: ComponentFixture<CheckInPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
