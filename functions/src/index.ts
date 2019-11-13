import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DayService } from './day-service';
import { FirestoreDocumentService } from './firestore';
import { Item } from './model';

admin.initializeApp();

const documentService = new FirestoreDocumentService();
const dayService = new DayService(documentService);

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate((event, context) =>
    dayService.addItemToDay({
      item: event.data() as Item,
      user: context.params['user']
    })
  );

export const onItemUpdate = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onUpdate((event, context) =>
    dayService.updateItemInDay({
      item: event.after.data() as Item,
      user: context.params['user']
    })
  );

export const onItemDeletion = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onDelete((event, context) =>
    dayService.removeItemFromDay({
      item: event.data() as Item,
      user: context.params['user']
    })
  );
