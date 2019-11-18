import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState, AppState } from '../reducers';
import { Day } from '../days.service';

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getUser = createSelector(getAuthState, s => s.user);
export const getUserId = createSelector(getUser, u => (u ? u.uid : undefined));

export const getAppState = createFeatureSelector<AppState>('app');
export const getCurrentDay = createSelector(getAppState, s => {
  const date = new Date();
  const iso = date.toISOString().substring(0, 10);
  return s.currentDay
    ? new Day(s.currentDay)
    : new Day({ uid: iso, items: [], target: { minutes: 420 } });
});
