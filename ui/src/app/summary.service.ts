import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, take, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

export type UsersSummary = {
  trackedMonths: { uid: string; balance: { minutes: number } }[];
};

const defaultSummary: UsersSummary = { trackedMonths: [] };

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  constructor(private readonly firestore: AngularFirestore) {}

  getSummaryForUser(user: string): Observable<UsersSummary> {
    return this.doc(user)
      .snapshotChanges()
      .pipe(map(s => s.payload.data() || defaultSummary));
  }

  private doc(user: string) {
    return this.firestore.collection(`userData`).doc<UsersSummary>(user);
  }
}
