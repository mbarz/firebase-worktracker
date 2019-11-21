import { TestBed } from '@angular/core/testing';

import { SummaryService } from './summary.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

describe('SummaryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: {} }
      ]
    })
  );

  it('should be created', () => {
    const service: SummaryService = TestBed.get(SummaryService);
    expect(service).toBeTruthy();
  });
});
