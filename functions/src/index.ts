import * as admin from 'firebase-admin';

admin.initializeApp();
export { onItemChange } from './item-changes';
export { onDayCreation } from './day-changes';
