import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DayService } from './day-service';
import { AppEventProxy } from './event';
import * as events from './item-events';
import { FirestoreDocumentService } from './firestore';
import { Item } from './model';
import { App } from './app';

admin.initializeApp();
const firestore = admin.firestore();

const documentService = new FirestoreDocumentService(firestore);
const dayService = new DayService(documentService);
const proxy = new AppEventProxy();
new App(proxy, dayService).init();
console.log('initialized app');

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate((event, context) => {
    console.log(`${context.resource.name} changed`);
    proxy.dispatch(
      events.createItemCreationEvent({
        item: event.data() as Item,
        user: context.params['user']
      })
    );
  });

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
