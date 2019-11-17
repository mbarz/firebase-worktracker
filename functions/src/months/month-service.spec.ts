import { MonthService } from './month-service';
import { InMemoryDocumentService } from '../testing/in-memory-document-service';
import { AppEventProxy } from '../event-proxy';
import { createDayUpdateEvent } from '../days/day-events';
import { Month, Day } from '../model';

describe('MonthService', () => {
  it('should add month on day update', async () => {
    const ds = new InMemoryDocumentService();
    const ms = new MonthService(ds);
    const proxy = new AppEventProxy();
    ms.observe(proxy);
    const before: Day = {
      uid: '2019-10-09',
      target: { minutes: 500 },
      items: []
    };
    const after: Day = {
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
    };
    await proxy.dispatch(
      createDayUpdateEvent({
        user: 'max',
        before,
        after: after
      })
    );
    const state = ds.getState();
    expect(state['userData/max/months']).toBeTruthy();
    expect(state['userData/max/months']['2019-10']).toBeTruthy();
    const data: Month = state['userData/max/months']['2019-10'];
    expect(data.uid).toEqual('2019-10');
    expect(data.categories).toEqual([
      { uid: 'foo', tracked: { minutes: 120 } }
    ]);
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

  it('should update month on day update', async () => {
    const ds = new InMemoryDocumentService();
    const ms = new MonthService(ds);
    const proxy = new AppEventProxy();

    ms.observe(proxy);
    const before: Day = {
      uid: '2019-10-09',
      target: { minutes: 500 },
      items: []
    };
    const day1: Day = {
      items: [
        {
          uid: 'a',
          title: 'a',
          category: 'foo',
          date: '2019-10-09',
          start: '10:00',
          end: '12:00'
        },
        {
          uid: 'b',
          title: 'b',
          category: 'bar',
          date: '2019-10-09',
          start: '10:00',
          end: '12:00'
        }
      ],
      target: { minutes: 300 },
      uid: '2019-10-09'
    };
    const day2: Day = {
      items: [
        {
          uid: 'a',
          title: 'a',
          category: 'foo',
          date: '2019-10-09',
          start: '10:00',
          end: '13:00'
        }
      ],
      target: { minutes: 300 },
      uid: '2019-10-09'
    };
    await proxy.dispatch(
      createDayUpdateEvent({
        user: 'max',
        before,
        after: day1
      })
    );

    await proxy.dispatch(
      createDayUpdateEvent({
        user: 'max',
        before: day1,
        after: day2
      })
    );

    const state = ds.getState();
    expect(state['userData/max/months']).toBeTruthy();
    expect(state['userData/max/months']['2019-10']).toBeTruthy();
    const data: Month = state['userData/max/months']['2019-10'];
    expect(data.uid).toEqual('2019-10');
    expect(data.categories).toEqual([
      { uid: 'foo', tracked: { minutes: 180 } }
    ]);
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
        reached: { minutes: 180 },
        target: { minutes: 300 },
        uid: '2019-10-09'
      },
      { reached: { minutes: 0 }, target: { minutes: 420 }, uid: '2019-10-10' }
    ]);
  });
});
