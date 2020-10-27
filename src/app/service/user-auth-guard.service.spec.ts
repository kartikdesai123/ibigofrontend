import { TestBed } from '@angular/core/testing';

import { UserAuthGuardService } from './user-auth-guard.service';

describe('UserAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAuthGuardService = TestBed.get(UserAuthGuardService);
    expect(service).toBeTruthy();
  });
});
