import { TestBed } from '@angular/core/testing';

import { JwtTokenInterceptorService } from './jwt-token-interceptor.service';

describe('JwtTokenInterceptorService', () => {
  let service: JwtTokenInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtTokenInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
