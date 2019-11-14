import { createEventFactory, props, AppEventProxy } from './event';

describe('EventProxy', () => {
  it('should listen on events', () => {
    const factoryA = createEventFactory('a', props<{ data: number }>());
    const factoryB = createEventFactory('b', props<{ data: string }>());

    expect(factoryA.type).toEqual('a');
    expect(factoryB.type).toEqual('b');

    const events = [
      factoryA({ data: 123 }),
      factoryB({ data: 'foo' }),
      factoryA({ data: 234 })
    ];
    const proxy = new AppEventProxy();

    const eventsOfTypeA: ReturnType<typeof factoryA>[] = [];
    const eventsOfTypeB: ReturnType<typeof factoryB>[] = [];

    const listenerA = proxy.on(factoryA, event => eventsOfTypeA.push(event));
    proxy.on(factoryB, event => eventsOfTypeB.push(event));

    events.forEach(e => proxy.dispatch(e));

    expect(eventsOfTypeA).toEqual([events[0], events[2]]);
    expect(eventsOfTypeB).toEqual([events[1]]);

    expect(eventsOfTypeA.length).toEqual(2);
    proxy.dispatch(factoryA({ data: 4 }));
    expect(eventsOfTypeA.length).toEqual(3);
    listenerA.detach();
    proxy.dispatch(factoryA({ data: 5 }));
    expect(eventsOfTypeA.length).toEqual(3);
  });
});
