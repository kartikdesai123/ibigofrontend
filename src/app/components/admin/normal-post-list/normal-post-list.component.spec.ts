import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalPostListComponent } from './normal-post-list.component';

describe('NormalPostListComponent', () => {
  let component: NormalPostListComponent;
  let fixture: ComponentFixture<NormalPostListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalPostListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
