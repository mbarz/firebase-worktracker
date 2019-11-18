import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NEVER, Observable } from 'rxjs';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { AdjustDayTargetDialogComponent } from '../adjust-day-target-dialog/adjust-day-target-dialog.component';
import { Day, DaysService } from '../days.service';
import { ItemDTO, Item } from '../item';
import { ItemsService } from '../items.service';
import { MonthDTO, MonthsService } from '../months.service';
import { SummaryService } from '../summary.service';
import { DataSource } from '@angular/cdk/table';
import { EditActivityDialogComponent } from '../edit-activity-dialog/edit-activity-dialog.component';
import { State } from '../reducers';
import { Store } from '@ngrx/store';
import { getCurrentDay } from '../selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDay$: Observable<Day> = this.store.select(getCurrentDay);
  currentMonth$: Observable<MonthDTO> = NEVER;
  summary$: Observable<any> = NEVER;

  displayedColumns = ['actions', 'day', 'diff'];
  displayedItemColumns = ['actions', 'title', 'category', 'time'];

  constructor(
    private readonly daysService: DaysService,
    private readonly monthsService: MonthsService,
    private readonly itemsService: ItemsService,
    private readonly summaryService: SummaryService,
    private readonly dialogService: MatDialog,
    private readonly store: Store<State>
  ) {}

  ngOnInit() {
    this.currentMonth$ = this.monthsService.getCurrentMonth();
    this.summary$ = this.summaryService.getSummary();
  }

  deleteItem(item: ItemDTO) {
    this.itemsService.deleteItem(item).subscribe();
  }

  editItem(item: Item) {
    const dlg = this.dialogService.open<
      EditActivityDialogComponent,
      EditActivityDialogComponent.Data,
      ItemDTO
    >(EditActivityDialogComponent, {
      data: { activity: item.dto },
      disableClose: true,
      width: '400px',
      maxWidth: '100vw'
    });
    dlg.beforeClosed().subscribe(dto => {
      if (dto) {
        console.log('writing data');
        this.itemsService.updateItem(dto).subscribe(result => {
          console.log('data written');
        });
      }
    });
  }

  openAddActivityDialog(day?: string) {
    const dlg = this.dialogService.open<
      AddActivityDialogComponent,
      AddActivityDialogComponent.Data,
      ItemDTO
    >(AddActivityDialogComponent, {
      data: { day },
      disableClose: true,
      width: '400px',
      maxWidth: '100vw'
    });
    dlg.beforeClosed().subscribe(item => {
      if (item) {
        this.itemsService.createItem(item).subscribe();
      }
    });
  }
  openAddActivityDialogForDay(day: string) {
    this.openAddActivityDialog(day);
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
