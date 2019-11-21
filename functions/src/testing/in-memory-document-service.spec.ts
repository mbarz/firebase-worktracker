import { InMemoryDocumentService } from './in-memory-document-service';

describe('InMemoryDocumentService', () => {
  it('should create document', async () => {
    const service = new InMemoryDocumentService();
    let doc = await service.getDocument({
      path: 'foo/bar',
      name: 'baz'
    });
    expect(await doc.exists()).toEqual(false);
    expect(await doc.getData()).toEqual(undefined);
    await doc.setData({ a: 3, b: 4 });
    expect(await doc.getData()).toEqual({ a: 3, b: 4 });
    doc = await service.getDocument({
      path: 'foo/bar',
      name: 'baz'
    });
    expect(await doc.getData()).toEqual({ a: 3, b: 4 });
  });
});
