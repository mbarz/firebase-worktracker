import { InMemoryDocumentService } from './in-memory-document-service';

describe('InMemoryDocumentService', () => {
  it('should create document', async () => {
    const service = new InMemoryDocumentService();
    let doc = await service.getOrCreateDocument({
      path: 'foo/bar',
      name: 'baz',
      defaultData: { a: 1, b: 2 }
    });
    expect(await doc.getData()).toEqual({ a: 1, b: 2 });
    await doc.setData({ a: 3, b: 4 });
    expect(await doc.getData()).toEqual({ a: 3, b: 4 });
    doc = await service.getOrCreateDocument({
      path: 'foo/bar',
      name: 'baz',
      defaultData: { a: 1, b: 2 }
    });
    expect(await doc.getData()).toEqual({ a: 3, b: 4 });
  });
});
