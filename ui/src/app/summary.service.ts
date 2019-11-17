import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, take, map, tap } from 'rxjs/operators';
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
      switchMap(user => {
        return user
          ? this.getSummaryForUser(user)
          : of({ message: 'no summary for user' });
      })
    );
  }
  getSummaryForUser(user: firebase.User): Observable<any> {
    console.log(`loading summary for ${user.displayName}`);
    return this.doc(user.uid)
      .snapshotChanges()
      .pipe(
        map(s => s.payload.data()),
        tap(s => {
          console.log(s);
        })
      );
  }

  private doc(user: string) {
    return this.firestore.collection<any>(`userData`).doc(user);
  }
}
