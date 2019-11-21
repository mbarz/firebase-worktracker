import { TestBed } from '@angular/core/testing';

import { DaysService } from './days.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

describe('DaysService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: {} }
      ]
    })
  );

  it('should be created', () => {
    const service: DaysService = TestBed.get(DaysService);
    expect(service).toBeTruthy();
  });
});
