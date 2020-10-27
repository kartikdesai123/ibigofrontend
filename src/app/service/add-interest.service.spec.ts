import { TestBed } from '@angular/core/testing';

import { AddInterestService } from './add-interest.service';

describe('AddInterestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddInterestService = TestBed.get(AddInterestService);
    expect(service).toBeTruthy();
  });
});
