import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHomepageComponent } from './business-homepage.component';

describe('BusinessHomepageComponent', () => {
  let component: BusinessHomepageComponent;
  let fixture: ComponentFixture<BusinessHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
