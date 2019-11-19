import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs/operators';
import * as actions from './actions';
import { AddActivityDialogComponent } from './add-activity-dialog/add-activity-dialog.component';
import { DaysService } from './days.service';
import { EditActivityDialogComponent } from './edit-activity-dialog/edit-activity-dialog.component';
import { ItemDTO } from './item';
import { ItemsService } from './items.service';
import { MonthsService } from './months.service';
import { SummaryService } from './summary.service';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly auth: AngularFireAuth,
    private readonly summaryService: SummaryService,
    private readonly monthsService: MonthsService,
    private readonly daysService: DaysService,
    private readonly itemsService: ItemsService,
    private readonly dialog: MatDialog
  ) {}

  setUser$ = createEffect(() =>
    this.auth.user.pipe(
      map(user =>
        user
          ? actions.setUser({
              user: {
                uid: user.uid,
                userName: user.displayName || user.email || user.uid
              }
            })
          : actions.setUser({ user: undefined })
      )
    )
  );

  loadCurrentDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.setUser),
      map(({ user }) => user),
      filter(inputIsTruthy),
      switchMap(user => {
        const date = new Date();
        const iso = date.toISOString().substring(0, 10);
        return this.daysService
          .getDayForUser(user.uid, iso)
          .pipe(map(day => actions.receiveCurrentDay({ day })));
      })
    )
  );

  loadCurrentMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.setUser),
      map(({ user }) => user),
      filter(inputIsTruthy),
      switchMap(() => {
        return this.monthsService
          .getCurrentMonth()
          .pipe(
            map(month => actions.receiveCurrentMonth({ month: month.dto }))
          );
      })
    )
  );

  loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.setUser),
      map(({ user }) => user),
      filter(inputIsTruthy),
      switchMap(user => {
        return this.summaryService
          .getSummaryForUser(user.uid)
          .pipe(map(summary => actions.receiveSummary({ summary })));
      })
    )
  );

  openActivityCreationDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.openActivityCreationDialog),
      map(({ day }) =>
        this.dialog.open<
          AddActivityDialogComponent,
          AddActivityDialogComponent.Data,
          ItemDTO
        >(AddActivityDialogComponent, {
          data: { day },
          disableClose: true,
          width: '400px',
          maxWidth: '100vw'
        })
      ),
      switchMap(dlg => dlg.beforeClosed()),
      filter(inputIsTruthy),
      map(item => actions.createActivity({ activity: item }))
    )
  );

  openActivityEditDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.openActivityEditDialog),
      map(({ activity }) =>
        this.dialog.open<
          EditActivityDialogComponent,
          EditActivityDialogComponent.Data,
          ItemDTO
        >(EditActivityDialogComponent, {
          data: { activity },
          disableClose: true,
          width: '400px',
          maxWidth: '100vw'
        })
      ),
      switchMap(dlg => dlg.beforeClosed()),
      filter(inputIsTruthy),
      map(item => actions.updateActivity({ activity: item }))
    )
  );

  createActivity$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.createActivity),
        switchMap(({ activity }) => this.itemsService.createItem(activity))
      ),
    { dispatch: false }
  );

  updateActivity$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.updateActivity),
        switchMap(({ activity }) => this.itemsService.updateItem(activity))
      ),
    { dispatch: false }
  );

  deleteActivity$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actions.deleteActivity),
        switchMap(({ activity }) => this.itemsService.deleteItem(activity))
      ),
    { dispatch: false }
  );
}

function inputIsTruthy<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined && !!input;
}
