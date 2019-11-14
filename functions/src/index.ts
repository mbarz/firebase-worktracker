import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DayService } from './day-service';
import { AppEventProxy } from './event';
import * as events from './events';
import { FirestoreDocumentService } from './firestore';
import { Item } from './model';
import { App } from './app';

admin.initializeApp();

const documentService = new FirestoreDocumentService();
const dayService = new DayService(documentService);
const proxy = new AppEventProxy();
new App(proxy, dayService);

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate((event, context) =>
    proxy.dispatch(
      events.createItemCreationEvent({
        item: event.data() as Item,
        user: context.params['user']
      })
    )
  );

export const onItemUpdate = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onUpdate((event, context) =>
    proxy.dispatch(
      events.createItemUpdateEvent({
        item: event.after.data() as Item,
        user: context.params['user']
      })
    )
  );

export const onItemDeletion = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onDelete((event, context) =>
    proxy.dispatch(
      events.createItemDeletionEvent({
        item: event.data() as Item,
        user: context.params['user']
      })
    )
  );
