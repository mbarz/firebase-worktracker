import { DocumentService } from '../documents';
import { Day, Item } from '../model';
import { AppEventProxy } from '../event';
import * as itemEvents from '../items/item-events';

export class DayService {
  constructor(private readonly documentService: DocumentService) {}

  observe(eventProxy: AppEventProxy) {
    eventProxy.on(itemEvents.createItemCreationEvent, ({ item, user }) =>
      this.addItemToDay({ item, user })
    );
    eventProxy.on(itemEvents.createItemDeletionEvent, ({ item, user }) =>
      this.removeItemFromDay({ item, user })
    );
    eventProxy.on(itemEvents.createItemUpdateEvent, ({ item, user }) =>
      this.updateItemInDay({ item, user })
    );
  }

  async addItemToDay({ item, user }: { item: Item; user: string }) {
    const doc = await this.getOrCreateDocumentForItem(user, item);
    const { items } = await doc.getData();
    items.push(item);
    await doc.updateData({ items });
  }

  async updateItemInDay({ item, user }: { item: Item; user: string }) {
    const doc = await this.getOrCreateDocumentForItem(user, item);
    const { items: oldItems } = await doc.getData();
    const items = oldItems.map(old => (old.uid === item.uid ? item : old));
    await doc.updateData({ items });
  }

  async removeItemFromDay({ item, user }: { item: Item; user: string }) {
    const doc = await this.getOrCreateDocumentForItem(user, item);
    const { items: oldItems } = await doc.getData();
    const items = oldItems.filter(i => i.uid !== item.uid);
    await doc.updateData({ items });
  }

  private getOrCreateDocumentForItem(user: string, item: Item) {
    return this.documentService.getOrCreateDocument<Day>({
      path: `userData/${user}/days`,
      name: item.date,
      defaultData: { uid: item.date, items: [], target: { minutes: 7 * 60 } }
    });
  }
}
