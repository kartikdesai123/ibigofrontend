import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestUpdateComponent } from './interest-update.component';

describe('InterestUpdateComponent', () => {
  let component: InterestUpdateComponent;
  let fixture: ComponentFixture<InterestUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
