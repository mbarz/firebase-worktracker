import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NEVER, Observable } from 'rxjs';
import { Day } from '../days.service';
import { MonthDTO } from '../months.service';
import { State } from '../reducers';
import { getCurrentDay, getCurrentMonth } from '../selectors';
import { SummaryService } from '../summary.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDay$: Observable<Day> = this.store.select(getCurrentDay);
  currentMonth$: Observable<MonthDTO> = NEVER;
  summary$: Observable<any> = NEVER;

  constructor(
    private readonly summaryService: SummaryService,
    private readonly store: Store<State>
  ) {}

  ngOnInit() {
    this.currentMonth$ = this.store.select(getCurrentMonth);
    this.summary$ = this.summaryService.getSummary();
  }
}
