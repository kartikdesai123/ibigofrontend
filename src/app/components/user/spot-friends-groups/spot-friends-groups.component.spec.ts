import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotFriendsGroupsComponent } from './spot-friends-groups.component';

describe('SpotFriendsGroupsComponent', () => {
  let component: SpotFriendsGroupsComponent;
  let fixture: ComponentFixture<SpotFriendsGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotFriendsGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotFriendsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
