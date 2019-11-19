import { DocumentService, WritableDocument } from '../documents';
import { Day, Item } from '../model';
import { AppEventProxy } from '../event-proxy';
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
    const doc = await this.getDocumentForItem(user, item);
    const data = await getDayDocOrDefaultData(doc, item.date);
    data.items.push(item);
    await doc.setData(data);
  }

  async updateItemInDay({ item, user }: { item: Item; user: string }) {
    const doc = await this.getDocumentForItem(user, item);
    const data = await getDayDocOrDefaultData(doc, item.date);
    const { items: oldItems } = data;
    const items = oldItems.map(old => (old.uid === item.uid ? item : old));
    await doc.setData({ ...data, items });
  }

  async removeItemFromDay({ item, user }: { item: Item; user: string }) {
    const doc = await this.getDocumentForItem(user, item);
    const data = await getDayDocOrDefaultData(doc, item.date);
    const { items: oldItems } = data;
    const items = oldItems.filter(i => i.uid !== item.uid);
    await doc.setData({ ...data, items });
  }

  private getDocumentForItem(user: string, item: Item) {
    return this.documentService.getDocument<Day>({
      path: `userData/${user}/days`,
      name: item.date
    });
  }
}
async function getDayDocOrDefaultData(
  doc: WritableDocument<Day>,
  date: string
) {
  const exists = await doc.exists();
  const defaultData = { uid: date, items: [], target: { minutes: 7 * 60 } };
  return exists ? await doc.getData() : defaultData;
}
