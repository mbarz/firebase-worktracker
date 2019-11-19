import { DocumentService, WritableDocument } from '../documents';
import { InMemoryDocument } from './in-memory-document';

type Memory = {
  [path: string]: {
    [name: string]: any;
  };
};

export class InMemoryDocumentService implements DocumentService {
  constructor(private memory: Memory = {}) {}

  getDocument<T>(args: {
    path: string;
    name: string;
  }): Promise<WritableDocument<T>> {
    const data = (this.memory[args.path] || {})[args.name];
    return Promise.resolve(new InMemoryDocument<T>(data));
  }

  getState() {
    return this.memory;
  }

  setState(state: Memory) {
    this.memory = state;
  }
}
