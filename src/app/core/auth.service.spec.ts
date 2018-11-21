import { TestBed, inject } from '@angular/core/testing';

import { AuthService2 } from './auth.service';

describe('AuthService2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService2]
    });
  });

  it('should be created', inject([AuthService2], (service: AuthService2) => {
    expect(service).toBeTruthy();
  }));
});
