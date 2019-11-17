import { Component, OnInit } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { DaysService, Day } from '../days.service';
import { ItemDTO } from '../item';
import { ItemsService } from '../items.service';
import { SummaryService } from '../summary.service';
import { MatDialog } from '@angular/material';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { MonthsService, MonthDTO } from '../months.service';
import { AdjustDayTargetDialogComponent } from '../adjust-day-target-dialog/adjust-day-target-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDay$: Observable<Day> = NEVER;
  currentMonth$: Observable<MonthDTO> = NEVER;
  summary$: Observable<any> = NEVER;

  constructor(
    private readonly daysService: DaysService,
    private readonly monthsService: MonthsService,
    private readonly itemsService: ItemsService,
    private readonly summaryService: SummaryService,
    private readonly dialogService: MatDialog
  ) {}

  ngOnInit() {
    const date = new Date();
    const iso = date.toISOString().substring(0, 10);
    this.currentDay$ = this.daysService.getDay(iso);
    this.currentMonth$ = this.monthsService.getCurrentMonth();
    this.summary$ = this.summaryService.getSummary();
  }

  deleteItem(item: ItemDTO) {
    this.itemsService.deleteItem(item).subscribe();
  }

  openAddActivityDialog() {
    const dlg = this.dialogService.open<
      AddActivityDialogComponent,
      AddActivityDialogComponent.Data,
      ItemDTO
    >(AddActivityDialogComponent, {
      data: {},
      disableClose: true
    });
    dlg.beforeClose().subscribe(item => {
      if (item) {
        this.itemsService.createItem(item).subscribe();
      }
    });
  }
  openAddActivityDialogForDay(day: string) {
    const dlg = this.dialogService.open<
      AddActivityDialogComponent,
      AddActivityDialogComponent.Data,
      ItemDTO
    >(AddActivityDialogComponent, {
      data: { day },
      disableClose: true
    });
    dlg.beforeClose().subscribe(item => {
      if (item) {
        this.itemsService.createItem(item).subscribe();
      }
    });
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
    dlg.beforeClose().subscribe(target => {
      if (target) {
        this.daysService.adjustDayTarget({ date: day.uid, target }).subscribe();
      }
    });
  }
}
