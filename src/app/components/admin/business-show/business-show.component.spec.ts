import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessShowComponent } from './business-show.component';

describe('BusinessShowComponent', () => {
  let component: BusinessShowComponent;
  let fixture: ComponentFixture<BusinessShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
