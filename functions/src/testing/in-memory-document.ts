import { WritableDocument } from '../documents';

export class InMemoryDocument<T> implements WritableDocument<T> {
  constructor(private readonly data?: T) {}

  exists() {
    return Promise.resolve(this.data !== undefined && this.data !== null);
  }

  setData(data: T): Promise<T> {
    Object.assign(this.data, data);
    return Promise.resolve(this.copy());
  }
  updateData(data: Partial<T>): Promise<Partial<T>> {
    Object.assign(this.data, {
      ...(this.data || {}),
      ...(JSON.parse(JSON.stringify(data)) as T)
    });
    return Promise.resolve(this.copy());
  }
  getData(): Promise<T> {
    return Promise.resolve(this.copy());
  }

  private copy() {
    return JSON.parse(JSON.stringify(this.data));
  }
}
