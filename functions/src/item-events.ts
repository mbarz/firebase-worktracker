import { createEventFactory, props } from './event';
import { Item } from './model';

export const createItemCreationEvent = createEventFactory(
  'itemCreation',
  props<{ user: string; item: Item }>()
);

export const createItemUpdateEvent = createEventFactory(
  'itemUpdate',
  props<{ user: string; item: Item }>()
);

export const createItemDeletionEvent = createEventFactory(
  'itemDeletion',
  props<{ user: string; item: Item }>()
);
