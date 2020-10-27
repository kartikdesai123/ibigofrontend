import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfileUpdateComponent } from './business-profile-update.component';

describe('BusinessProfileUpdateComponent', () => {
  let component: BusinessProfileUpdateComponent;
  let fixture: ComponentFixture<BusinessProfileUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfileUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
