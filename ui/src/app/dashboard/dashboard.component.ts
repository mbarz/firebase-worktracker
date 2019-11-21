import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Day } from '../days.service';
import { MonthDTO } from '../months.service';
import { State } from '../reducers';
import { getCurrentDay, getCurrentMonth } from '../selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDay$: Observable<Day> = this.store.select(getCurrentDay);
  currentMonth$: Observable<MonthDTO> = this.store.select(getCurrentMonth);

  constructor(private readonly store: Store<State>) {}

  ngOnInit() {}
}
