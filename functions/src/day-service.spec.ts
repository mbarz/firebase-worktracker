import { DayService } from './day-service';
import { Day } from './model';
import { createFakeItem } from './testing/fake-item';
import { InMemoryDocumentService } from './testing/in-memory-document-service';

describe('DayService', () => {
  let documentService: InMemoryDocumentService;
  let service: DayService;
  beforeEach(() => {
    documentService = new InMemoryDocumentService();
    service = new DayService(documentService);
  });

  it('should add an item to a day', async () => {
    const item1 = createFakeItem({ date: '2019-01-02' });
    const item2 = createFakeItem({ date: '2019-01-02' });
    await service.addItemToDay({ item: item1, user: 'max' });
    await service.addItemToDay({ item: item2, user: 'max' });
    const dayDocument = await documentService.getDocument<Day>({
      path: 'userData/max/days',
      name: '2019-01-02'
    });
    const day = await dayDocument.getData();
    expect(day).toEqual({
      items: [item1, item2],
      target: { minutes: 420 },
      uid: '2019-01-02'
    });
  });

  it('should update an item to a day', async () => {
    const item1 = createFakeItem({ date: '2019-01-02' });
    const item2 = createFakeItem({ date: '2019-01-02' });
    await service.addItemToDay({ item: item1, user: 'max' });
    await service.addItemToDay({ item: item2, user: 'max' });
    await service.updateItemInDay({
      item: { ...item1, end: '15:00' },
      user: 'max'
    });
    const dayDocument = await documentService.getDocument<Day>({
      path: 'userData/max/days',
      name: '2019-01-02'
    });
    const day = await dayDocument.getData();
    expect(day).toEqual({
      items: [{ ...item1, end: '15:00' }, item2],
      target: { minutes: 420 },
      uid: '2019-01-02'
    });
  });

  it('should remove an item from a day', async () => {
    const item1 = createFakeItem({ date: '2019-01-02' });
    const item2 = createFakeItem({ date: '2019-01-02' });
    await service.addItemToDay({ item: item1, user: 'max' });
    await service.addItemToDay({ item: item2, user: 'max' });
    await service.removeItemFromDay({
      item: item1,
      user: 'max'
    });
    const dayDocument = await documentService.getDocument<Day>({
      path: 'userData/max/days',
      name: '2019-01-02'
    });
    const day = await dayDocument.getData();
    expect(day).toEqual({
      items: [item2],
      target: { minutes: 420 },
      uid: '2019-01-02'
    });
  });
});
