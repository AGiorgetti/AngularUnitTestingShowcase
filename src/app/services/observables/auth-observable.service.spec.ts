import { TestBed } from '@angular/core/testing';

import { AuthObservableService } from './auth-observable.service';

describe('AuthObservableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthObservableService = TestBed.get(AuthObservableService);
    expect(service).toBeTruthy();
  });
});
