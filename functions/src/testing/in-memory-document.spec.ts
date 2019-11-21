import { InMemoryDocument } from './in-memory-document';

describe('InMemoryDocument', () => {
  it('should get data', async () => {
    const data = { foo: 'bar' };
    const doc = new InMemoryDocument(
      { 'foo/bar': { baz: data } },
      'foo/bar',
      'baz'
    );
    expect(await doc.getData()).toEqual(data);
  });

  it('should update data', async () => {
    const data = { a: 1, b: 2 };
    const doc = new InMemoryDocument(
      { 'files/collectionA': { fileA: data } },
      'files/collectionA',
      'fileA'
    );
    expect(await doc.getData()).toEqual(data);
    await doc.updateData({ b: 3 });
    expect(await doc.getData()).toEqual({ a: 1, b: 3 });
  });
});
