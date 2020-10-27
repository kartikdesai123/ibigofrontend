import { TestBed } from '@angular/core/testing';

import { UserHomeServiceService } from './user-home-service.service';

describe('UserHomeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserHomeServiceService = TestBed.get(UserHomeServiceService);
    expect(service).toBeTruthy();
  });
});
