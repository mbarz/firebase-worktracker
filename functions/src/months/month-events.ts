import { createEventFactory, props } from '../event-proxy';
import { Month } from '../model';

export const createMonthUpdateEvent = createEventFactory(
  'monthUpdate',
  props<{ user: string; before: Month; after: Month }>()
);
