import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { NEVER, Observable } from 'rxjs';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { AdjustDayTargetDialogComponent } from '../adjust-day-target-dialog/adjust-day-target-dialog.component';
import { Day, DaysService } from '../days.service';
import { ItemDTO } from '../item';
import { ItemsService } from '../items.service';
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
