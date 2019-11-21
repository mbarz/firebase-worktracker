import { TestBed } from '@angular/core/testing';

import { ItemsService } from './items.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

describe('ItemsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: {} }
      ]
    })
  );

  it('should be created', () => {
    const service: ItemsService = TestBed.get(ItemsService);
    expect(service).toBeTruthy();
  });
});
