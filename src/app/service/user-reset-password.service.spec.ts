import { TestBed } from '@angular/core/testing';

import { UserResetPasswordService } from './user-reset-password.service';

describe('UserResetPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserResetPasswordService = TestBed.get(UserResetPasswordService);
    expect(service).toBeTruthy();
  });
});
