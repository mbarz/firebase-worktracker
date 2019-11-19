import { AppEventProxy } from '../event-proxy';
import * as dayEvents from '../days/day-events';
import { Day, Month, Item, CategoryTrackingSummary } from '../model';
import { DocumentService } from '../documents';

export class MonthService {
  constructor(private readonly documentService: DocumentService) {}

  observe(eventProxy: AppEventProxy) {
    eventProxy.on(dayEvents.createDayUpdateEvent, ({ user, before, after }) =>
      this.updateMonthWithChangedDay(user, { after, before })
    );
    eventProxy.on(dayEvents.createDayCreateEvent, ({ user, day }) =>
      this.updateMonthWithChangedDay(user, { after: day })
    );
  }

  async updateMonthWithChangedDay(
    user: string,
    change: { before?: Day; after: Day }
  ) {
    const month = change.after.uid.substring(0, 7);
    const doc = await this.getMonthDocumentForDay(user, month);

    const data: Month = (await doc.exists())
      ? await doc.getData()
      : createDefaultDataForMonth(month);

    this.updateCategories(data, change);
    this.updateDaySummary(data, change.after);
    return doc.setData(data);
  }

  private updateDaySummary(data: Month, after: Day) {
    const dayData = data.days.find(d => d.uid === after.uid);
    if (dayData) {
      dayData.target = after.target;
      const reached = { minutes: 0 };
      const items = after.items.map(item => ({
        ...item,
        minutes: this.getMinutesFromItem(item)
      }));
      items.forEach(item => (reached.minutes += item.minutes));
      dayData.reached = reached;
    }
  }

  private updateCategories(
    data: Month,
    { before, after }: { before?: Day; after: Day }
  ) {
    const categories = data.categories;
    (before ? before.items : []).forEach(item => {
      const category = this.getOrCreateTrackedCategory(
        categories,
        item.category
      );
      category.tracked.minutes -= this.getMinutesFromItem(item);
    });
    after.items.forEach(item => {
      const category = this.getOrCreateTrackedCategory(
        categories,
        item.category
      );
      category.tracked.minutes += this.getMinutesFromItem(item);
    });
    data.categories = categories.filter(c => c.tracked.minutes !== 0);
  }

  private getOrCreateTrackedCategory(
    categories: CategoryTrackingSummary[],
    uid: string
  ): CategoryTrackingSummary {
    let cat = categories.find(c => c.uid === uid);
    if (!cat) {
      cat = { uid, tracked: { minutes: 0 } };
      categories.push(cat);
    }
    return cat;
  }

  private getMinutesFromItem(item: Item) {
    const [start, end] = [item.start, item.end].map(
      t => new Date(`2019-01-01 ${t}:00.000`)
    );
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes;
  }

  private async getMonthDocumentForDay(user: string, month: string) {
    console.log('getting', month);
    return await this.documentService.getDocument<Month>({
      path: `userData/${user}/months`,
      name: month
    });
  }
}
function createDefaultDataForMonth(month: string): Month {
  const dates: Date[] = [];
  const date = new Date(month + '-01');
  const m = date.getMonth();
  date.setHours(12, 0, 0, 0);
  while (date.getMonth() === m) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  const workdays = [1, 2, 3, 4, 5];
  const days: {
    uid: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[] = dates.map(d => {
    const uid = d.toISOString().substring(0, 10);
    return {
      uid,
      target: { minutes: workdays.includes(d.getDay()) ? 420 : 0 },
      reached: { minutes: 0 }
    };
  });
  return { uid: month, days, categories: [] };
}
