import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestListComponent } from './interest-list.component';

describe('InterestListComponent', () => {
  let component: InterestListComponent;
  let fixture: ComponentFixture<InterestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
