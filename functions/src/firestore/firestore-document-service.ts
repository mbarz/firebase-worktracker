import { DocumentService } from '../documents/document-service';
import { FirestoreDocument } from './firestore-document';

export class FirestoreDocumentService implements DocumentService {
  constructor(private readonly firestore: FirebaseFirestore.Firestore) {}

  async getOrCreateDocument<T>({
    path,
    name,
    defaultData
  }: {
    path: string;
    name: string;
    defaultData: T;
  }) {
    const doc = this.firestore.collection(path).doc(name);
    const snap = await doc.get();
    if (!snap.exists) await doc.set(defaultData);
    return new FirestoreDocument<T>(doc);
  }
}
