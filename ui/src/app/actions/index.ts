import { createAction, props } from '@ngrx/store';
import { DayDTO } from '../days.service';
import { ItemDTO } from '../item';
import { MonthDTO } from '../months.service';
import { StoredDay } from '../reducers';

export const setUser = createAction(
  '[App] Set User',
  props<{ user?: { uid: string; userName: string } }>()
);
export const loadCurrentDay = createAction('[App] Load Current Day');
export const receiveCurrentDay = createAction(
  '[App] Receive Current Day',
  props<{ day?: DayDTO }>()
);
export const loadCurrentMonth = createAction('[App] Load Current Month');
export const receiveCurrentMonth = createAction(
  '[App] Receive Current Month',
  props<{ month?: MonthDTO }>()
);
export const loadSummary = createAction('[App] Load Summary');

export const openActivityCreationDialog = createAction(
  '[App] Open Activity Creation Dialog',
  props<{ day?: StoredDay | string }>()
);

export const openActivityEditDialog = createAction(
  '[App] Open Activity Edit Dialog',
  props<{ activity: ItemDTO }>()
);

export const createActivity = createAction(
  '[App] Create Activity',
  props<{ activity: ItemDTO }>()
);

export const updateActivity = createAction(
  '[App] Update Activity',
  props<{ activity: ItemDTO }>()
);

export const deleteActivity = createAction(
  '[App] Delete Activity',
  props<{ activity: ItemDTO }>()
);
