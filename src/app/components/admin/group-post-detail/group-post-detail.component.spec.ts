import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPostDetailComponent } from './group-post-detail.component';

describe('GroupPostDetailComponent', () => {
  let component: GroupPostDetailComponent;
  let fixture: ComponentFixture<GroupPostDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPostDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
