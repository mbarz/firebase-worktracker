import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DayService } from './days/day-service';
import { AppEventProxy } from './event';
import * as events from './items/item-events';
import { FirestoreDocumentService } from './firestore';
import { Item } from './model';

admin.initializeApp();
const firestore = admin.firestore();

const proxy = new AppEventProxy();

const documentService = new FirestoreDocumentService(firestore);
new DayService(documentService).observe(proxy);

console.log('===============================');

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

export const onDayCreation = functions.firestore
  .document('userData/{user}/days/{day}')
  .onCreate((event, context) => {
    console.log(context.resource.name, 'created');
  });

export const onDayUpdate = functions.firestore
  .document('userData/{user}/days/{day}')
  .onUpdate((event, context) => {
    console.log(context.resource.name, 'updated');
  });
