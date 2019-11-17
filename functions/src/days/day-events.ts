import { createEventFactory, props } from '../event';
import { Day } from '../model';

export const createDayUpdateEvent = createEventFactory(
  'dayUpdate',
  props<{ user: string; before: Day; after: Day }>()
);
