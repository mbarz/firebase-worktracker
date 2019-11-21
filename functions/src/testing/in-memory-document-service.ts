import { DocumentService, WritableDocument } from '../documents';
import { InMemoryDocument } from './in-memory-document';
import { Memory } from './memory';

export class InMemoryDocumentService implements DocumentService {
  constructor(private memory: Memory = {}) {}

  getDocument<T>(args: {
    path: string;
    name: string;
  }): Promise<WritableDocument<T>> {
    return Promise.resolve(
      new InMemoryDocument<T>(this.memory, args.path, args.name)
    );
  }

  getState() {
    return this.memory;
  }

  setState(state: Memory) {
    this.memory = state;
  }
}
