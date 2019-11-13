import { InMemoryDocument } from './in-memory-document';

describe('InMemoryDocument', () => {
  it('should get data', async () => {
    const data = { foo: 'bar' };
    const doc = new InMemoryDocument(data);
    expect(await doc.getData()).toEqual(data);
  });

  it('should set data', async () => {
    const data = { foo: 'bar' };
    const doc = new InMemoryDocument(data);
    await doc.setData({ foo: 'baz' });
    expect(await doc.getData()).toEqual({ foo: 'baz' });
  });

  it('should update data', async () => {
    const data = { a: 1, b: 2 };
    const doc = new InMemoryDocument(data);
    await doc.updateData({ b: 3 });
    expect(await doc.getData()).toEqual({ a: 1, b: 3 });
  });
});
