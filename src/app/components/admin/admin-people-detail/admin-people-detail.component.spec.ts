import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeopleDetailComponent } from './admin-people-detail.component';

describe('AdminPeopleDetailComponent', () => {
  let component: AdminPeopleDetailComponent;
  let fixture: ComponentFixture<AdminPeopleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPeopleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPeopleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
