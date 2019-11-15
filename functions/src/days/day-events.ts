import { createEventFactory, props } from '../event';
import { Day } from '../model';

export const createDayCreationEvent = createEventFactory(
  'dayCreation',
  props<{ user: string; day: Day }>()
);

export const createDayUpdateEvent = createEventFactory(
  'dayUpdate',
  props<{ user: string; day: Day }>()
);
