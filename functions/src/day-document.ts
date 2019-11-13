import { Day } from './model/day';
import { Item } from './model/item';
import { WritableDocument } from './document';

export class DayDocumentWriter {
  constructor(private readonly doc: WritableDocument<Day>) {}

  async addItem(item: Item) {
    const { items } = await this.doc.getData();
    items.push(item);
    await this.doc.updateData({ items });
  }

  async removeItem(item: Item) {
    const { items: oldItems } = await this.doc.getData();
    const items = oldItems.filter(i => i.uid !== item.uid);
    await this.doc.updateData({ items });
  }

  async updateItem(item: Item) {
    const { items: oldItems } = await this.doc.getData();
    const items = oldItems.map(old => (old.uid === item.uid ? item : old));
    await this.doc.updateData({ items });
  }
}
