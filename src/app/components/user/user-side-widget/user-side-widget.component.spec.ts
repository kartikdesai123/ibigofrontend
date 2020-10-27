import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSideWidgetComponent } from './user-side-widget.component';

describe('UserSideWidgetComponent', () => {
  let component: UserSideWidgetComponent;
  let fixture: ComponentFixture<UserSideWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSideWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSideWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
