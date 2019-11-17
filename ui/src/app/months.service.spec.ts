import { TestBed } from '@angular/core/testing';

import { MonthsService } from './months.service';

describe('MonthsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonthsService = TestBed.get(MonthsService);
    expect(service).toBeTruthy();
  });
});
