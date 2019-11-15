import { DocumentService, WritableDocument } from '../documents';
import { InMemoryDocument } from './in-memory-document';

type Memory = {
  [path: string]: {
    [name: string]: any;
  };
};

export class InMemoryDocumentService implements DocumentService {
  constructor(private memory: Memory = {}) {}
  getOrCreateDocument<T>(args: {
    path: string;
    name: string;
    defaultData: T;
  }): Promise<WritableDocument<T>> {
    const collection = this.memory[args.path] || {};
    this.memory[args.path] = collection;
    const data = collection[args.name] || args.defaultData;
    collection[args.name] = data;
    const doc = new InMemoryDocument(data);
    return Promise.resolve(doc);
  }

  getDocument<T>(args: { path: string; name: string }) {
    const data = (this.memory[args.path] || {})[args.name];
    if (!data) {
      return Promise.reject(
        new Error(`document "${args.path}/${args.name}" does not exits`)
      );
    } else {
      return Promise.resolve(new InMemoryDocument<T>(data));
    }
  }

  getState() {
    return this.memory;
  }

  setState(state: Memory) {
    this.memory = state;
  }
}
