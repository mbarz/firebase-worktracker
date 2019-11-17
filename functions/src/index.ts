import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as dayEvents from './days/day-events';
import { DayService } from './days/day-service';
import { AppEventProxy } from './event-proxy';
import { FirestoreDocumentService } from './firestore';
import * as itemEvents from './items/item-events';
import { Day, Item, Month } from './model';
import * as monthEvents from './months/month-events';
import { MonthService } from './months/month-service';
import { SummaryService } from './summary/summary-service';

admin.initializeApp();
const firestore = admin.firestore();

const proxy = new AppEventProxy();

const documentService = new FirestoreDocumentService(firestore);
new DayService(documentService).observe(proxy);
new MonthService(documentService).observe(proxy);
new SummaryService(documentService).observe(proxy);

console.log('===============================');

export const onItemCreation = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onCreate((event, context) =>
    proxy.dispatch(
      itemEvents.createItemCreationEvent({
        item: event.data() as Item,
        user: context.params['user']
      })
    )
  );

export const onItemUpdate = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onUpdate((event, context) =>
    proxy.dispatch(
      itemEvents.createItemUpdateEvent({
        item: event.after.data() as Item,
        user: context.params['user']
      })
    )
  );

export const onItemDeletion = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onDelete((event, context) =>
    proxy.dispatch(
      itemEvents.createItemDeletionEvent({
        item: event.data() as Item,
        user: context.params['user']
      })
    )
  );

export const onDayUpdate = functions.firestore
  .document('userData/{user}/days/{day}')
  .onUpdate((event, context) =>
    proxy.dispatch(
      dayEvents.createDayUpdateEvent({
        user: context.params['user'],
        before: event.before.data() as Day,
        after: event.after.data() as Day
      })
    )
  );

export const onMonthUpdate = functions.firestore
  .document('userData/{user}/months/{month}')
  .onUpdate((event, context) =>
    proxy.dispatch(
      monthEvents.createMonthUpdateEvent({
        user: context.params['user'],
        before: event.before.data() as Month,
        after: event.after.data() as Month
      })
    )
  );
