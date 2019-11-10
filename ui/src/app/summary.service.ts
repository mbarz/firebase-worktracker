import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, take, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  getSummary(): Observable<any> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => (user ? this.getSummaryForUser(user) : of({})))
    );
  }
  getSummaryForUser(user: firebase.User): Observable<any> {
    return this.doc(user.uid)
      .snapshotChanges()
      .pipe(map(s => s.payload.data()));
  }

  private doc(user: string) {
    return this.firestore.collection<any>(`userData`).doc(user);
  }
}
