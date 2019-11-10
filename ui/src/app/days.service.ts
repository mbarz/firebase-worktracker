import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Item, ItemDTO } from './item';

export type DayDTO = {
  day: string;
  user: string;
  items: ItemDTO[];
};

export class Day {
  target = {
    milliseconds: 7 * 60 * 60 * 1000
  };
  day: string;
  user: string;
  items: Item[];
  constructor(data: DayDTO) {
    this.day = data.day;
    this.user = data.user;
    this.items = data.items.map(item => new Item(item));
  }

  get duration() {
    const milliseconds = this.items
      .map(i => i.duration.milliseconds)
      .reduce((a, b) => a + b, 0);
    return { milliseconds };
  }

  get percentage() {
    return (this.duration.milliseconds / this.target.milliseconds) * 100;
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

  getDay(date: string): Observable<Day> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user =>
        user
          ? this.getDayForUser(user, date)
          : throwError(new Error('User needs to be logged in to receive data'))
      )
    );
  }
  getDayForUser(user: firebase.User, date: string): Observable<Day> {
    return this.collection(user.uid)
      .doc<DayDTO>(date)
      .snapshotChanges()
      .pipe(
        map(snap => {
          const data = snap.payload.exists ? snap.payload.data() : undefined;
          return data || { day: date, user: user.uid, items: [] };
        }),
        map(data => new Day(data))
      );
  }

  private collection(user: string) {
    return this.firestore.collection<any>(`userData/${user}/days`);
  }
}
