import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestAddComponent } from './interest-add.component';

describe('InterestAddComponent', () => {
  let component: InterestAddComponent;
  let fixture: ComponentFixture<InterestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
