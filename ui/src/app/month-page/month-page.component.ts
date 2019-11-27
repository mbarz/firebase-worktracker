import { Component, OnInit } from '@angular/core';
import { Month, MonthsService } from '../months.service';
import { Observable, NEVER } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { map, tap, withLatestFrom, switchMap } from 'rxjs/operators';
import { getUserId } from '../selectors';

@Component({
  selector: 'app-month-page',
  templateUrl: './month-page.component.html',
  styleUrls: ['./month-page.component.scss']
})
export class MonthPageComponent implements OnInit {
  month$: Observable<Month> = NEVER;

  year = '';
  monthName = '';

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    monthsService: MonthsService
  ) {
    this.month$ = route.params.pipe(
      map(p => p.month as string),
      tap(month => {
        const [y, m] = month.split('-').map(part => parseInt(part, 10));
        const date = new Date(y, m - 1, 1);
        this.year = y.toString();
        this.monthName = date.toLocaleString('en-US', { month: 'long' });
      }),
      withLatestFrom(store.select(getUserId)),
      switchMap(([month, userId]) =>
        userId
          ? monthsService
              .getMonthForUser({ userId, month })
              .pipe(map(data => new Month(data)))
          : NEVER
      )
    );
  }

  ngOnInit() {}
}
