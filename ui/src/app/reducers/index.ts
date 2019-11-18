import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import * as actions from './../actions';
import { DayDTO } from '../days.service';
import { MonthDTO } from '../months.service';
import { ItemDTO } from '../item';

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
};
export const initialAppState: AppState = {};

export interface State {
  auth: AuthState;
  app: AppState;
}

const authReducer = createReducer<AuthState>(
  { user: undefined },
  on(actions.setUser, (state, action) => ({ ...state, user: action.user }))
);

const appReducer = createReducer<AppState>(
  initialAppState,
  on(actions.receiveCurrentDay, (s, a) => ({ ...s, currentDay: a.day })),
  on(actions.receiveCurrentMonth, (s, a) => ({ ...s, currentMonth: a.month })),
  on(
    actions.createActivity,
    actions.deleteActivity,
    actions.updateActivity,
    (s, a) => setAffectedLoadingFlags(s, a)
  )
);

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  app: appReducer
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

  console.log({
    date,
    month: currentMonth ? currentMonth.uid : '-',
    isChangedItemInCurrentMonth
  });

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
  console.log({ updatedMonth });
  return {
    ...state,
    currentDay: updatedDay,
    currentMonth: updatedMonth
  };
}
