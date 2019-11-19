export interface WritableDocument<T> {
  setData(data: T): Promise<T>;
  updateData(data: Partial<T>): Promise<Partial<T>>;
  getData(): Promise<T>;
  exists(): Promise<boolean>;
}
