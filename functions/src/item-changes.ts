import * as functions from 'firebase-functions';
import { DayDocumentWriter } from './day-document';
import { ItemDocumentData } from './item';
import { getOrCreateFirestoreDayDocumentForItem } from './firestore-helpers';

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate(event => {
    const item = event.data() as ItemDocumentData;
    return getOrCreateFirestoreDayDocumentForItem(item).then(doc =>
      new DayDocumentWriter(doc).addItem(item)
    );
  });

export const onItemUpdate = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onUpdate(event => {
    const item = event.after.data() as ItemDocumentData;
    return getOrCreateFirestoreDayDocumentForItem(item).then(doc =>
      new DayDocumentWriter(doc).updateItem(item)
    );
  });

export const onItemDeletion = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onDelete(event => {
    const item = event.data() as ItemDocumentData;
    return getOrCreateFirestoreDayDocumentForItem(item).then(doc =>
      new DayDocumentWriter(doc).removeItem(item)
    );
  });
