import { DayService } from './days/day-service';
import { AppEventProxy } from './event-proxy';
import * as events from './items/item-events';
import { InMemoryDocumentService } from './testing/in-memory-document-service';

describe('App', () => {
  let proxy: AppEventProxy;
  let dayService: DayService;
  let documentService: InMemoryDocumentService;
  beforeEach(() => {
    proxy = new AppEventProxy();
    documentService = new InMemoryDocumentService();
    dayService = new DayService(documentService);
    dayService.observe(proxy);
  });
  it('should create day, when item is created', async () => {
    const item = {
      uid: '123',
      title: 'item a',
      category: 'foo',
      date: '2019-10-10',
      start: '10:00',
      end: '12:00'
    };
    await proxy.dispatch(
      events.createItemCreationEvent({
        user: 'max',
        item: item
      })
    );

    expect(documentService.getState()).toEqual({
      'userData/max/days': {
        '2019-10-10': {
          uid: '2019-10-10',
          items: [item],
          target: { minutes: 420 }
        }
      }
    });
  });
  it('should update day, when item is updated', async () => {
    const stateBefore = {
      'userData/max/days': {
        '2019-10-10': {
          uid: '2019-10-10',
          items: [
            {
              uid: '123',
              title: 'item a',
              category: 'foo',
              date: '2019-10-10',
              start: '10:00',
              end: '12:00'
            }
          ],
          target: { minutes: 420 }
        }
      }
    };
    const event = events.createItemUpdateEvent({
      user: 'max',
      item: {
        uid: '123',
        title: 'item a',
        category: 'foo',
        date: '2019-10-10',
        start: '10:00',
        end: '13:00'
      }
    });
    const expectedState = {
      'userData/max/days': {
        '2019-10-10': {
          uid: '2019-10-10',
          items: [event.item],
          target: { minutes: 420 }
        }
      }
    };

    documentService.setState(stateBefore);
    await proxy.dispatch(event);
    expect(documentService.getState()).toEqual(expectedState);
  });

  it('should remove item from day, when item is deleted', async () => {
    const originalState = {
      'userData/max/days': {
        '2019-10-10': {
          uid: '2019-10-10',
          items: [
            {
              uid: '123',
              title: 'item a',
              category: 'foo',
              date: '2019-10-10',
              start: '10:00',
              end: '12:00'
            }
          ],
          target: { minutes: 420 }
        }
      }
    };
    const event = events.createItemDeletionEvent({
      user: 'max',
      item: originalState['userData/max/days']['2019-10-10'].items[0]
    });
    const expectedResultState = {
      'userData/max/days': {
        '2019-10-10': {
          uid: '2019-10-10',
          items: [],
          target: { minutes: 420 }
        }
      }
    };

    documentService.setState(originalState);
    await proxy.dispatch(event);

    expect(documentService.getState()).toEqual(expectedResultState);
  });
});
