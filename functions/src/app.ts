import { DayService } from './day-service';
import { AppEventProxy } from './event';
import * as events from './item-events';

export class App {
  constructor(
    private readonly eventProxy: AppEventProxy,
    private readonly dayService: DayService
  ) {}

  init() {
    this.eventProxy.on(events.createItemCreationEvent, ({ item, user }) =>
      this.dayService.addItemToDay({ item, user })
    );
    this.eventProxy.on(events.createItemDeletionEvent, ({ item, user }) =>
      this.dayService.removeItemFromDay({ item, user })
    );
    this.eventProxy.on(events.createItemUpdateEvent, ({ item, user }) =>
      this.dayService.updateItemInDay({ item, user })
    );
  }
}
