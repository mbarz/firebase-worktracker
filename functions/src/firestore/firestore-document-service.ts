import * as admin from 'firebase-admin';
import { DocumentService } from '../documents/document-service';
import { FirestoreDocument } from './firestore-document';
const firestore = admin.firestore();

export class FirestoreDocumentService implements DocumentService {
  async getOrCreateDocument<T>({
    path,
    name,
    defaultData
  }: {
    path: string;
    name: string;
    defaultData: T;
  }) {
    const doc = firestore.collection(path).doc(name);
    const snap = await doc.get();
    if (!snap.exists) await doc.set(defaultData);
    return new FirestoreDocument<T>(doc);
  }
}
