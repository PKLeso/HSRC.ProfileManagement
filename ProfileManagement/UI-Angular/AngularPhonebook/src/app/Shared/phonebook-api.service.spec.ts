import { TestBed } from '@angular/core/testing';

import { PhonebookApiService } from './phonebook-api.service';

describe('PhonebookApiService', () => {
  let service: PhonebookApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhonebookApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
