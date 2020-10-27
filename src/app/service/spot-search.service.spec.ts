import { TestBed } from '@angular/core/testing';

import { SpotSearchService } from './spot-search.service';

describe('SpotSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpotSearchService = TestBed.get(SpotSearchService);
    expect(service).toBeTruthy();
  });
});
