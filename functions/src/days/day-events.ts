import { createEventFactory, props } from '../event-proxy';
import { Day } from '../model';

export const createDayUpdateEvent = createEventFactory(
  'dayUpdate',
  props<{ user: string; before: Day; after: Day }>()
);

export const createDayCreateEvent = createEventFactory(
  'dayCreation',
  props<{ user: string; day: Day }>()
);
