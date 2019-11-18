import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Item, ItemDTO } from './item';

export type DayDTO = {
  uid: string;
  items: ItemDTO[];
  target: { minutes: number };
};

export class Day {
  target: {
    minutes: number;
  };
  uid: string;
  items: Item[];
  constructor(public dto: DayDTO) {
    this.uid = dto.uid;
    this.items = dto.items.map(item => new Item(item));
    this.target = dto.target;
  }

  get duration() {
    const minutes = this.items
      .map(i => i.duration.minutes)
      .reduce((a, b) => a + b, 0);
    return { minutes };
  }

  get percentage() {
    return (this.duration.minutes / this.target.minutes) * 100;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  getDays(): Observable<DayDTO[]> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => (user ? this.getDaysForUser(user) : of([])))
    );
  }
  getDaysForUser(user: firebase.User): Observable<DayDTO[]> {
    return this.collection(user.uid).valueChanges();
  }

  getDayForUser(userId: string, date: string): Observable<DayDTO | undefined> {
    return this.collection(userId)
      .doc<DayDTO>(date)
      .snapshotChanges()
      .pipe(
        map(snap => (snap.payload.exists ? snap.payload.data() : undefined))
      );
  }

  adjustDayTarget({
    date,
    target
  }: {
    date: string;
    target: { minutes: number };
  }) {
    return this.auth.user.pipe(
      take(1),
      switchMap(user =>
        user
          ? this.adjustDayTargetForUser({ user: user.uid, date, target })
          : EMPTY
      )
    );
  }

  private adjustDayTargetForUser({
    user,
    date,
    target
  }: {
    user: string;
    date: string;
    target: { minutes: number };
  }) {
    return this.collection(user)
      .doc<DayDTO>(date)
      .update({ target });
  }

  private collection(user: string) {
    return this.firestore.collection<any>(`userData/${user}/days`);
  }
}
