export interface WritableDocument<T> {
  exists(): Promise<boolean>;
  setData(data: T): Promise<T>;
  updateData(data: Partial<T>): Promise<Partial<T>>;
  getData(): Promise<T>;
}
