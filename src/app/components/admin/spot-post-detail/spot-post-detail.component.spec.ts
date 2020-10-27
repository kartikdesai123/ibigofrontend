import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotPostDetailComponent } from './spot-post-detail.component';

describe('SpotPostDetailComponent', () => {
  let component: SpotPostDetailComponent;
  let fixture: ComponentFixture<SpotPostDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotPostDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
