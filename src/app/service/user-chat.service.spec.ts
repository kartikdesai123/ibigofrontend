import { TestBed } from '@angular/core/testing';

import { UserChatService } from './user-chat.service';

describe('UserChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserChatService = TestBed.get(UserChatService);
    expect(service).toBeTruthy();
  });
});
