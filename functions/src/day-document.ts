import { DayDocumentData } from './day';
import { ItemDocumentData } from './item';
import { WritableDocument } from './document';

export class DayDocumentWriter {
  constructor(private readonly doc: WritableDocument<DayDocumentData>) {}

  async addItem(item: ItemDocumentData) {
    const { items } = await this.doc.getData();
    items.push(item);
    await this.doc.updateData({ items });
  }

  async removeItem(item: ItemDocumentData) {
    const { items: oldItems } = await this.doc.getData();
    const items = oldItems.filter(i => i.uid !== item.uid);
    await this.doc.updateData({ items });
  }

  async updateItem(item: ItemDocumentData) {
    const { items: oldItems } = await this.doc.getData();
    const items = oldItems.map(old => (old.uid === item.uid ? item : old));
    await this.doc.updateData({ items });
  }
}
