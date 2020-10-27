import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUpdateComponent } from './business-update.component';

describe('BusinessUpdateComponent', () => {
  let component: BusinessUpdateComponent;
  let fixture: ComponentFixture<BusinessUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
