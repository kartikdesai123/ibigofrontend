import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotPostListComponent } from './spot-post-list.component';

describe('SpotPostListComponent', () => {
  let component: SpotPostListComponent;
  let fixture: ComponentFixture<SpotPostListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotPostListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
