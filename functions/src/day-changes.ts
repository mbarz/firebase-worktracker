import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const firestore = admin.firestore();

export type Summary = {
  days: string[];
};

export const onDayCreation = functions.firestore
  .document('userData/{user}/days/{day}')
  .onCreate(async (event, context) => {
    const user: string = context.params['user'];
    const day: string = context.params['day'];
    const doc = await getOrCreateSummary(user);
    const data = await getSummaryData(doc);
    await setSummaryData(doc, { ...data, days: [...data.days, day] });
  });

async function getOrCreateSummary(
  user: string
): Promise<FirebaseFirestore.DocumentReference> {
  const doc = firestore.collection(`userData`).doc(user);
  const snap = await doc.get();
  if (!snap.exists) {
    await setSummaryData(doc, { days: [] });
  }
  return doc;
}

function getSummaryData(
  doc: FirebaseFirestore.DocumentReference
): Promise<Summary> {
  return doc.get().then(snap => snap.data() as Summary);
}

function setSummaryData(
  doc: FirebaseFirestore.DocumentReference,
  data: Summary
) {
  return doc.set(data);
}
