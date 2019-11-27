import { ActionReducerMap, createReducer, on, Action } from '@ngrx/store';
import * as actions from './../actions';
import { DayDTO } from '../days.service';
import { MonthDTO } from '../months.service';
import { ItemDTO } from '../item';
import { UsersSummary } from '../summary.service';

export type User = {
  uid: string;
  userName: string;
};

export type AuthState = {
  user?: User;
};

export type StoredDay = DayDTO & {
  loading?: boolean;
};

export type StoredMonth = MonthDTO & {
  loading?: boolean;
};

export type AppState = {
  currentDay?: StoredDay;
  currentMonth?: StoredMonth;
  summary: UsersSummary;
};
export const initialAppState: AppState = { summary: { trackedMonths: [] } };

export interface State {
  auth: AuthState;
  app: AppState;
}

const authReducer = createReducer<AuthState>(
  { user: undefined },
  on(actions.setUser, (state, action) => ({ ...state, user: action.user }))
);

export function reduceAuth(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

const appReducer = createReducer<AppState>(
  initialAppState,
  on(actions.setUser, (s, a) => ({ summary: { trackedMonths: [] } })),
  on(actions.receiveCurrentDay, (s, a) => ({ ...s, currentDay: a.day })),
  on(actions.receiveCurrentMonth, (s, a) => ({ ...s, currentMonth: a.month })),
  on(
    actions.createActivity,
    actions.deleteActivity,
    actions.updateActivity,
    (s, a) => setAffectedLoadingFlags(s, a)
  ),
  on(actions.receiveSummary, (s, a) => ({ ...s, summary: a.summary }))
);

export function reduceApp(state: AppState | undefined, action: Action) {
  return appReducer(state, action);
}

export const reducers: ActionReducerMap<State> = {
  auth: reduceAuth,
  app: reduceApp
};

function setAffectedLoadingFlags(
  state: AppState,
  { activity }: { activity: ItemDTO }
): AppState {
  const date = activity.date;
  const currentDay = state.currentDay;
  const isChangedItemInCurrentDay = !!currentDay && currentDay.uid === date;

  const currentMonth = state.currentMonth;

  const isChangedItemInCurrentMonth =
    !!currentMonth && date.startsWith(currentMonth.uid);

  const updatedMonth = currentMonth
    ? {
        ...currentMonth,
        loading: isChangedItemInCurrentMonth
      }
    : undefined;
  const updatedDay = currentDay
    ? {
        ...currentDay,
        loading: isChangedItemInCurrentDay
      }
    : undefined;
  return {
    ...state,
    currentDay: updatedDay,
    currentMonth: updatedMonth
  };
}
