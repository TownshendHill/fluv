import { TestBed } from '@angular/core/testing';

import { LucideIconService } from './lucide-icon.service';

describe('LucideIconService', () => {
  let service: LucideIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LucideIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
