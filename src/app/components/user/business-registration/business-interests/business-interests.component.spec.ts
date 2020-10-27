import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInterestsComponent } from './business-interests.component';

describe('BusinessInterestsComponent', () => {
  let component: BusinessInterestsComponent;
  let fixture: ComponentFixture<BusinessInterestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessInterestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
