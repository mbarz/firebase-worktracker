import { WritableDocument } from '../documents';
import { Memory } from './memory';

export class InMemoryDocument<T> implements WritableDocument<T> {
  constructor(
    private readonly memory: Memory,
    private readonly path: string,
    private readonly name: string
  ) {}

  exists() {
    return this.getData().then(data => !!data);
  }

  setData(data: T): Promise<T> {
    let collection = this.memory[this.path];
    if (!collection) {
      collection = {};
      this.memory[this.path] = collection;
    }
    collection[this.name] = data;
    return Promise.resolve(this.copy());
  }
  async updateData(data: Partial<T>): Promise<Partial<T>> {
    const old = await this.getData();
    const updated = {
      ...(old || {}),
      ...(JSON.parse(JSON.stringify(data)) as T)
    };
    return this.setData(updated).then(() => this.copy());
  }
  getData(): Promise<T> {
    const collection = this.memory[this.path];
    if (!collection) {
      return Promise.resolve(undefined as any);
    }
    return Promise.resolve(collection[this.name]);
  }

  private copy() {
    const data = this.getData();
    return data ? JSON.parse(JSON.stringify(data)) : undefined;
  }
}
