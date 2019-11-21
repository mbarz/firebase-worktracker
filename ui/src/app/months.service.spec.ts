import { TestBed } from '@angular/core/testing';

import { MonthsService } from './months.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

describe('MonthsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: {} }
      ]
    })
  );

  it('should be created', () => {
    const service: MonthsService = TestBed.get(MonthsService);
    expect(service).toBeTruthy();
  });
});
