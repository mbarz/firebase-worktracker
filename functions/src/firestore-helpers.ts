import { DayDocumentData } from './day';
import { FirestoreDocument } from './firestore-document';
import { ItemDocumentData } from './item';

export function getOrCreateFirestoreDayDocumentForItem(item: ItemDocumentData) {
  const user = item.user;
  const start = new Date(item.start);
  const day = start.toISOString().substring(0, 10);
  return getOrCreateFirestoreDayDocument(user, day);
}

async function getOrCreateFirestoreDayDocument(
  user: string,
  day: string
): Promise<FirestoreDocument<DayDocumentData>> {
  const doc = new FirestoreDocument<DayDocumentData>(
    `userData/${user}/days`,
    day
  );
  if (!(await doc.exists())) {
    await doc.setData({ day, user, items: [] });
  }
  return doc;
}
