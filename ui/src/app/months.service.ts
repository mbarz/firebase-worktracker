import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DayDTO } from './days.service';
import { StoredMonth } from './reducers';

export type CategoryTrackingSummary = {
  uid: string;
  tracked: {
    minutes: number;
  };
};

export type MonthDTO = {
  uid: string;
  days: {
    uid: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[];
  categories: CategoryTrackingSummary[];
};

export class Month {
  target: { minutes: number };
  reached: { minutes: number };
  totalTarget: { minutes: number };
  pastDays: {
    uid: string;
    weekDay: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[];
  loading = false;

  constructor(public readonly dto: StoredMonth) {
    this.loading = dto.loading || false;
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.pastDays = dto.days
      .filter(day => {
        const d = new Date(day.uid);
        return d.getTime() < Date.now();
      })
      .map(d => {
        return { ...d, weekDay: weekdays[new Date(d.uid).getDay()] };
      });
    this.pastDays.sort((a, b) => b.uid.localeCompare(a.uid));
    this.target = {
      minutes: this.pastDays
        .map(d => d.target.minutes)
        .reduce((a, b) => a + b, 0)
    };
    this.totalTarget = {
      minutes: this.days.map(d => d.target.minutes).reduce((a, b) => a + b, 0)
    };
    this.reached = {
      minutes: this.pastDays
        .map(d => d.reached.minutes)
        .reduce((a, b) => a + b, 0)
    };
  }

  get uid() {
    return this.dto.uid;
  }

  get days() {
    return this.dto.days;
  }
  get categories() {
    return this.dto.categories;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MonthsService {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  public getCurrentMonth(): Observable<Month> {
    const now = new Date();
    const month = now.toISOString().substring(0, 7);
    console.log('loading month', month);
    return this.getMonth(month);
  }

  public getMonth(month: string): Observable<Month> {
    return this.user$().pipe(
      map(user => this.collection(user.uid)),
      switchMap(collection => this.getMonthFromCollection(collection, month))
    );
  }

  private getMonthFromCollection(
    collection: AngularFirestoreCollection<MonthDTO>,
    month: string
  ): Observable<Month> {
    return collection
      .doc<MonthDTO>(month)
      .snapshotChanges()
      .pipe(map(snap => this.getMonthFromSnapshot(snap.payload)));
  }

  private getMonthFromSnapshot(snap: DocumentSnapshot<MonthDTO>): Month {
    const data = snap.exists ? snap.data() : undefined;
    return new Month(data || this.defaultMonthData(snap.id));
  }

  private defaultMonthData(month: string): MonthDTO {
    return { categories: [], days: [], uid: month };
  }

  private user$() {
    return this.auth.user.pipe(
      filter(user => !!user),
      map(user => user as firebase.User)
    );
  }

  private collection(user: string) {
    return this.firestore.collection<MonthDTO>(`userData/${user}/months`);
  }
}
