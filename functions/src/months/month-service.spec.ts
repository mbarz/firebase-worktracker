import { MonthService } from './month-service';
import { InMemoryDocumentService } from '../testing/in-memory-document-service';
import { AppEventProxy } from '../event';
import { createDayUpdateEvent } from '../days/day-events';
import { Month } from '../model';

describe('MonthService', () => {
  it('should add month on day update', async () => {
    const ds = new InMemoryDocumentService();
    const ms = new MonthService(ds);
    const proxy = new AppEventProxy();
    ms.observe(proxy);
    proxy.dispatch(
      createDayUpdateEvent({
        user: 'max',
        day: {
          items: [
            {
              uid: '123',
              title: 'stuff',
              category: 'foo',
              date: '2019-10-09',
              start: '10:00',
              end: '12:00'
            }
          ],
          target: { minutes: 300 },
          uid: '2019-10-09'
        }
      })
    );
    await wait();
    const state = ds.getState();
    expect(state['userData/max/months']).toBeTruthy();
    expect(state['userData/max/months']['2019-10']).toBeTruthy();
    const data: Month = state['userData/max/months']['2019-10'];
    expect(data.uid).toEqual('2019-10');
    expect(data.categories).toEqual([]);
    expect(data.days.length).toEqual(31);
    expect(data.days.slice(0, 10)).toEqual([
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-01' },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-02' },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-03' },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-04' },
      { reached: { minutes: 0 }, target: { minutes: 0 }, uid: '2019-10-05' },
      { reached: { minutes: 0 }, target: { minutes: 0 }, uid: '2019-10-06' },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-07' },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-08' },
      {
        reached: { minutes: 120 },
        target: { minutes: 300 },
        uid: '2019-10-09'
      },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-10' }
    ]);
  });
});

function wait(t: number = 0) {
  return new Promise(resolve => setTimeout(() => resolve(), t));
}
