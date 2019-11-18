import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, filter, switchMap } from 'rxjs/operators';
import * as actions from './actions';
import { User } from './reducers';
import { DaysService } from './days.service';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly auth: AngularFireAuth,
    private readonly daysService: DaysService
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
      filter(({ user }) => !!user),
      map(({ user }) => user as User),
      switchMap(user => {
        const date = new Date();
        const iso = date.toISOString().substring(0, 10);
        return this.daysService
          .getDayForUser(user.uid, iso)
          .pipe(map(day => actions.receiveCurrentDay({ day })));
      })
    )
  );
}
