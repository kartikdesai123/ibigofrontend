import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotEventComponent } from './spot-event.component';

describe('SpotEventComponent', () => {
  let component: SpotEventComponent;
  let fixture: ComponentFixture<SpotEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
