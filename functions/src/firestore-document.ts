import * as admin from 'firebase-admin';
import { WritableDocument } from './document';
const firestore = admin.firestore();

export class FirestoreDocument<T> implements WritableDocument<T> {
  doc: FirebaseFirestore.DocumentReference;

  constructor(collection: string, name: string) {
    this.doc = firestore.collection(collection).doc(name);
  }

  exists() {
    return this.doc.get().then(snap => snap.exists);
  }

  setData(data: T) {
    return this.doc.set(data).then(() => data);
  }

  updateData(data: Partial<T>) {
    return this.doc.update(data).then(() => data);
  }

  getData(): Promise<T> {
    return this.doc.get().then(snap => snap.data() as T);
  }
}
