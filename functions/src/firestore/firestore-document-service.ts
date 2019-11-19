import { DocumentService } from '../documents/document-service';
import { FirestoreDocument } from './firestore-document';

export class FirestoreDocumentService implements DocumentService {
  constructor(private readonly firestore: FirebaseFirestore.Firestore) {}

  async getDocument<T>({ path, name }: { path: string; name: string }) {
    const doc = this.firestore.collection(path).doc(name);
    return new FirestoreDocument<T>(doc);
  }
}
