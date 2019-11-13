import { DocumentService, WritableDocument } from '../documents';
import { InMemoryDocument } from './in-memory-document';

export class InMemoryDocumentService implements DocumentService {
  constructor(
    private memory: { [path: string]: { [name: string]: any } } = {}
  ) {}
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

  getDocumentPaths() {
    return Object.keys(this.memory)
      .map(path =>
        Object.keys(this.memory[path]).map(name => `${path}/${name}`)
      )
      .reduce((a, b) => [...a, ...b], []);
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
}
