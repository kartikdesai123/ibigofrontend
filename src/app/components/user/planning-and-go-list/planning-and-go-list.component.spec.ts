import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAndGoListComponent } from './planning-and-go-list.component';

describe('PlanningAndGoListComponent', () => {
  let component: PlanningAndGoListComponent;
  let fixture: ComponentFixture<PlanningAndGoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningAndGoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningAndGoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
