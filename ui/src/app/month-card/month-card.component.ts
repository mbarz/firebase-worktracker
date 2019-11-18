import { Component, OnInit, Input } from '@angular/core';
import { Month } from '../months.service';
import { Store } from '@ngrx/store';
import {
  openActivityCreationDialog,
  openActivityEditDialog,
  deleteActivity
} from '../actions';
import { Item } from '../item';
import { AdjustDayTargetDialogComponent } from '../adjust-day-target-dialog/adjust-day-target-dialog.component';
import { MatDialog } from '@angular/material';
import { DaysService } from '../days.service';

@Component({
  selector: 'app-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss']
})
export class MonthCardComponent implements OnInit {
  @Input() month!: Month;

  displayedColumns = ['actions', 'day', 'diff'];

  constructor(
    private readonly store: Store<any>,
    private readonly dialogService: MatDialog,
    private readonly daysService: DaysService
  ) {}

  ngOnInit() {}

  createItem(day: string) {
    this.store.dispatch(openActivityCreationDialog({ day }));
  }

  openDayTargetAdjustmentDialog(day: {
    target: { minutes: number };
    uid: string;
  }) {
    const dlg = this.dialogService.open<
      AdjustDayTargetDialogComponent,
      AdjustDayTargetDialogComponent.Data,
      { minutes: number }
    >(AdjustDayTargetDialogComponent, {
      data: { day },
      disableClose: true
    });
    dlg.beforeClosed().subscribe(target => {
      if (target) {
        this.daysService.adjustDayTarget({ date: day.uid, target }).subscribe();
      }
    });
  }
}
