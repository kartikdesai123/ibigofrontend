import { TestBed } from '@angular/core/testing';

import { UserForgotPasswordService } from './user-forgot-password.service';

describe('UserForgotPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserForgotPasswordService = TestBed.get(UserForgotPasswordService);
    expect(service).toBeTruthy();
  });
});
