import { WritableDocument } from './document';
export interface DocumentService {
  getOrCreateDocument<T>(args: {
    path: string;
    name: string;
    defaultData: T;
  }): Promise<WritableDocument<T>>;
}
