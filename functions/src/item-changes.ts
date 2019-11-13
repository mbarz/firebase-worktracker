import * as functions from 'firebase-functions';
import { DayDocumentWriter } from './day-document';
import { Item } from './model/item';
import { getOrCreateFirestoreDayDocumentForItem } from './firestore-helpers';

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate((event, context) => {
    const user: string = context.params['user'];
    const item = event.data() as Item;
    return getOrCreateFirestoreDayDocumentForItem(user, item).then(doc =>
      new DayDocumentWriter(doc).addItem(item)
    );
  });

export const onItemUpdate = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onUpdate((event, context) => {
    const user: string = context.params['user'];
    const item = event.after.data() as Item;
    return getOrCreateFirestoreDayDocumentForItem(user, item).then(doc =>
      new DayDocumentWriter(doc).updateItem(item)
    );
  });

export const onItemDeletion = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onDelete((event, context) => {
    const item = event.data() as Item;
    const user: string = context.params['user'];
    return getOrCreateFirestoreDayDocumentForItem(user, item).then(doc =>
      new DayDocumentWriter(doc).removeItem(item)
    );
  });
