import { ActionReducerMap, MetaReducer, createReducer, on } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as actions from './../actions';
import { DayDTO } from '../days.service';
import { MonthDTO } from '../months.service';

export type User = {
  uid: string;
  userName: string;
};

export type AuthState = {
  user?: User;
};

export type AppState = {
  currentDay?: DayDTO;
  currentMonth?: MonthDTO;
};

export interface State {
  auth: AuthState;
  app: AppState;
}

const authReducer = createReducer<AuthState>(
  { user: undefined },
  on(actions.setUser, (state, action) => ({ ...state, user: action.user }))
);

const appReducer = createReducer<AppState>(
  {},
  on(actions.receiveCurrentDay, (s, a) => ({ ...s, currentDay: a.day }))
);

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  app: appReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
