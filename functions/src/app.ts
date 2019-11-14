import { DayService } from './day-service';
import { AppEventProxy } from './event';
import * as events from './events';

export class App {
  constructor(
    private readonly eventProxy: AppEventProxy,
    private readonly days: DayService
  ) {}

  init() {
    this.eventProxy.on(events.createItemCreationEvent, ({ item, user }) =>
      this.days.addItemToDay({ item, user })
    );
    this.eventProxy.on(events.createItemDeletionEvent, ({ item, user }) =>
      this.days.removeItemFromDay({ item, user })
    );
    this.eventProxy.on(events.createItemUpdateEvent, ({ item, user }) =>
      this.days.updateItemInDay({ item, user })
    );
  }
}
