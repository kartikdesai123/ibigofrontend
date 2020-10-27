import { TestBed } from '@angular/core/testing';

import { AdminForgotPasswordService } from './admin-forgot-password.service';

describe('AdminForgotPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminForgotPasswordService = TestBed.get(AdminForgotPasswordService);
    expect(service).toBeTruthy();
  });
});
