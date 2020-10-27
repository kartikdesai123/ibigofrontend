import { TestBed } from '@angular/core/testing';

import { AdminChangePasswordService } from './admin-change-password.service';

describe('AdminChangePasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminChangePasswordService = TestBed.get(AdminChangePasswordService);
    expect(service).toBeTruthy();
  });
});
