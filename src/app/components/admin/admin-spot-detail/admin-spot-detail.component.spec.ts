import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSpotDetailComponent } from './admin-spot-detail.component';

describe('AdminSpotDetailComponent', () => {
  let component: AdminSpotDetailComponent;
  let fixture: ComponentFixture<AdminSpotDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSpotDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSpotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
