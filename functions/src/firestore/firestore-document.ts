import { WritableDocument } from '../documents/document';

export class FirestoreDocument<T> implements WritableDocument<T> {
  constructor(private readonly doc: FirebaseFirestore.DocumentReference) {}

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
