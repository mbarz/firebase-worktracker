import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DayDocumentData } from './day';
import { ItemDocumentData } from './item';

const firestore = admin.firestore();

export const onItemChange = functions.firestore
  .document('userData/{user}/items/{documentId}')
  .onWrite(async event => {
    const { before, after } = event;
    if (!before.exists && after.exists) {
      const item = after.data();
      if (item) {
        await addItem(item as ItemDocumentData);
      }
    } else if (before.exists && !after.exists) {
      const item = before.data();
      if (item) {
        await removeItem(item as ItemDocumentData);
      }
    } else if (before.exists && after.exists) {
      const item = before.data();
      if (item) {
        await updateItem(item as ItemDocumentData);
      }
    }
  });

async function getOrCreateDay(
  user: string,
  day: string
): Promise<FirebaseFirestore.DocumentReference> {
  console.log(day);
  const doc = firestore.collection(`userData/${user}/days`).doc(day);
  const snap = await doc.get();
  if (!snap.exists) {
    await setDayData(doc, { day, user, items: [] });
  }
  return doc;
}

function getDayData(
  doc: FirebaseFirestore.DocumentReference
): Promise<DayDocumentData> {
  return doc.get().then(snap => snap.data() as DayDocumentData);
}

function setDayData(
  doc: FirebaseFirestore.DocumentReference,
  data: DayDocumentData
) {
  return doc.set(data);
}

function updateDayData(
  doc: FirebaseFirestore.DocumentReference,
  data: Partial<DayDocumentData>
) {
  return doc.update(data);
}

async function addItem(item: ItemDocumentData) {
  const user = item.user;
  const start = new Date(item.start);
  const day = start.toISOString().substring(0, 10);
  const doc = await getOrCreateDay(user, day);
  const dayData = await getDayData(doc);
  if (dayData) {
    await updateDayData(doc, { items: [...dayData.items, item] });
  }
}
async function updateItem(item: ItemDocumentData) {
  const user = item.user;
  const start = new Date(item.start);
  const day = start.toISOString().substring(0, 10);
  const doc = await getOrCreateDay(user, day);
  const dayData = await getDayData(doc);
  if (dayData) {
    await doc.update({
      items: dayData.items.map(old => (old.uid === item.uid ? item : old))
    });
  }
}
async function removeItem(item: ItemDocumentData) {
  const user = item.user;
  const start = new Date(item.start);
  const day = start.toISOString().substring(0, 10);
  const doc = await getOrCreateDay(user, day);
  const dayData = await getDayData(doc);
  if (dayData) {
    await doc.update({ items: dayData.items.filter(i => i.uid !== item.uid) });
  }
}
