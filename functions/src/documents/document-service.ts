import { WritableDocument } from './document';
export interface DocumentService {
  getDocument<T>(args: {
    path: string;
    name: string;
  }): Promise<WritableDocument<T>>;
}
