import { TestBed } from '@angular/core/testing';

import { AboutCoronaService } from './about-corona.service';

describe('AboutCoronaService', () => {
  let service: AboutCoronaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutCoronaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
