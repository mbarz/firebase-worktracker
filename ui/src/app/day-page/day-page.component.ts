import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NEVER, Observable } from 'rxjs';
import { map, switchMap, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Day, DaysService } from '../days.service';
import { getUserId } from '../selectors';

@Component({
  selector: 'app-day-page',
  templateUrl: './day-page.component.html',
  styleUrls: ['./day-page.component.scss']
})
export class DayPageComponent implements OnInit {
  day$: Observable<Day> = NEVER;

  year = '';
  month = { id: '', text: '' };
  dayName = '';
  nextDay = '';
  previousDay = '';

  constructor(
    private readonly store: Store<any>,
    private readonly route: ActivatedRoute,
    private readonly daysService: DaysService
  ) {}

  ngOnInit() {
    this.day$ = this.route.params.pipe(
      filter(p => p.day),
      map(p => p.day as string),
      tap(day => {
        const [y, m, d] = day.split('-').map(part => parseInt(part, 10));
        const date = new Date(y, m - 1, d);
        this.year = y.toString();
        this.month = {
          id:
            y.toString().padStart(4, '0') + '-' + m.toString().padStart(2, '0'),
          text: date.toLocaleString('en-US', { month: 'long' })
        };
        this.dayName =
          date.toLocaleString('en-US', { weekday: 'long' }) +
          ', ' +
          date.toLocaleString('default', { day: '2-digit' });

        const ref = new Date(date);
        ref.setHours(12);
        ref.setDate(ref.getDate() - 1);
        this.previousDay = new Date(ref).toISOString().substring(0, 10);
        ref.setDate(ref.getDate() + 2);
        this.nextDay = new Date(ref).toISOString().substring(0, 10);
      }),
      withLatestFrom(this.store.select(getUserId)),
      switchMap(([day, user]) =>
        this.daysService
          .getDayForUser(user || '', day)
          .pipe(map(d => new Day(d)))
      )
    );
  }
}
