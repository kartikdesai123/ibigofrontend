import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalPostDetailComponent } from './normal-post-detail.component';

describe('NormalPostDetailComponent', () => {
  let component: NormalPostDetailComponent;
  let fixture: ComponentFixture<NormalPostDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalPostDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
