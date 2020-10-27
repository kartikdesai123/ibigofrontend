import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleBusinessComponent } from './google-business.component';

describe('GoogleBusinessComponent', () => {
  let component: GoogleBusinessComponent;
  let fixture: ComponentFixture<GoogleBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
