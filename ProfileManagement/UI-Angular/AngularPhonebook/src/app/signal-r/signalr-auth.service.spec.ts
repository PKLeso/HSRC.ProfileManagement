import { TestBed } from '@angular/core/testing';

import { SignalrAuthService } from './signalr-auth.service';

describe('SignalrAuthService', () => {
  let service: SignalrAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
