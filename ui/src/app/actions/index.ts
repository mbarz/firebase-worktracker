import { createAction, props } from '@ngrx/store';
import { Day, DayDTO } from '../days.service';

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
export const loadSummary = createAction('[App] Load Summary');
