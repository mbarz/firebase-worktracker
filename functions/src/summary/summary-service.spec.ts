import { SummaryService } from './summary-service';
import { InMemoryDocumentService } from '../testing/in-memory-document-service';
import { AppEventProxy } from '../event-proxy';
import { createMonthUpdateEvent } from '../months/month-events';

describe('Summary', () => {
  it('should update on month change', async () => {
    const ds = new InMemoryDocumentService();
    const proxy = new AppEventProxy();
    const s = new SummaryService(ds);
    s.observe(proxy);
    await proxy.dispatch(
      createMonthUpdateEvent({
        user: 'max',
        before: { uid: '2019-10', categories: [], days: [] },
        after: {
          uid: '2019-10',
          categories: [],
          days: [
            {
              uid: '2019-10-10',
              target: { minutes: 120 },
              reached: { minutes: 60 }
            },
            {
              uid: '2019-10-11',
              target: { minutes: 120 },
              reached: { minutes: 240 }
            }
          ]
        }
      })
    );
    expect(ds.getState()).toEqual({
      userData: {
        max: {
          balance: { minutes: 60 },
          trackedMonths: [{ uid: '2019-10', balance: { minutes: 60 } }]
        }
      }
    });
    await proxy.dispatch(
      createMonthUpdateEvent({
        user: 'max',
        before: { uid: '2019-10', categories: [], days: [] },
        after: {
          uid: '2019-11',
          categories: [],
          days: [
            {
              uid: '2019-11-10',
              target: { minutes: 120 },
              reached: { minutes: 90 }
            },
            {
              uid: '2019-11-11',
              target: { minutes: 120 },
              reached: { minutes: 120 }
            }
          ]
        }
      })
    );
    expect(ds.getState()).toEqual({
      userData: {
        max: {
          balance: { minutes: 30 },
          trackedMonths: [
            { uid: '2019-10', balance: { minutes: 60 } },
            { uid: '2019-11', balance: { minutes: -30 } }
          ]
        }
      }
    });
  });
});
