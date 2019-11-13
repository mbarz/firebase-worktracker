import { FirestoreDocument } from './firestore-document';
import { Day } from './model/day';
import { Item } from './model/item';

export function getOrCreateFirestoreDayDocumentForItem(
  user: string,
  item: Item
) {
  const start = new Date(item.start);
  const day = start.toISOString().substring(0, 10);
  return getOrCreateFirestoreDayDocument(user, day);
}

export async function getOrCreateFirestoreDayDocument(
  user: string,
  day: string
): Promise<FirestoreDocument<Day>> {
  const doc = new FirestoreDocument<Day>(`userData/${user}/days`, day);
  if (!(await doc.exists())) {
    await doc.setData({ uid: day, items: [], target: { minutes: 7 * 60 } });
  }
  return doc;
}
