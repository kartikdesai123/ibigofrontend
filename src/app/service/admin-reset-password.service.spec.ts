import { TestBed } from '@angular/core/testing';

import { AdminResetPasswordService } from './admin-reset-password.service';

describe('AdminResetPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminResetPasswordService = TestBed.get(AdminResetPasswordService);
    expect(service).toBeTruthy();
  });
});
