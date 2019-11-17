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
  pastDays: {
    uid: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[];

  constructor(private data: MonthDTO) {
    this.pastDays = data.days.filter(day => {
      const d = new Date(day.uid);
      return d.getTime() < Date.now();
    });
    this.pastDays.sort((a, b) => b.uid.localeCompare(a.uid));
    this.target = {
      minutes: this.pastDays
        .map(d => d.target.minutes)
        .reduce((a, b) => a + b, 0)
    };
    this.reached = {
      minutes: this.pastDays
        .map(d => d.reached.minutes)
        .reduce((a, b) => a + b, 0)
    };
  }

  get uid() {
    return this.data.uid;
  }

  get days() {
    return this.data.days;
  }
  get categories() {
    return this.data.categories;
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
