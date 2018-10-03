import { TestBed } from '@angular/core/testing';

import { AuthObservableApiService } from './auth-observable-api.service';

describe('AuthObservableApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthObservableApiService = TestBed.get(AuthObservableApiService);
    expect(service).toBeTruthy();
  });
});
