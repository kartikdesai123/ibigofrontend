import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupDetailComponent } from './admin-group-detail.component';

describe('AdminGroupDetailComponent', () => {
  let component: AdminGroupDetailComponent;
  let fixture: ComponentFixture<AdminGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
