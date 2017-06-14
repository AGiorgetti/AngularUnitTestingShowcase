import { TestBed, inject } from '@angular/core/testing';

import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService]
    });
  });

  it('should be created', inject([AuthApiService], (service: AuthApiService) => {
    expect(service).toBeTruthy();
  }));
});
