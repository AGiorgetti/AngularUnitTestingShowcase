import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AuthApiService } from "app/services/auth-api.service";

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        AuthService
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
