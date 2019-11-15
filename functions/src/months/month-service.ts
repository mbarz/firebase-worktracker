import { AppEventProxy } from '../event';
import * as dayEvents from '../days/day-events';
import { Day, Month, Item } from '../model';
import { DocumentService } from '../documents';

export class MonthService {
  constructor(private readonly documentService: DocumentService) {}

  observe(eventProxy: AppEventProxy) {
    eventProxy.on(dayEvents.createDayUpdateEvent, ({ user, day }) =>
      this.updateMonthWithDay(user, day)
    );
  }

  async updateMonthWithDay(user: string, day: Day) {
    const month = day.uid.substring(0, 7);
    const doc = await this.getMonthDocumentForDay(user, month);
    const data = await doc.getData();
    const dayData = data.days.find(d => d.uid === day.uid);

    if (dayData) {
      dayData.target = day.target;
      const reached = { minutes: 0 };
      const items = day.items.map(item => ({
        ...item,
        minutes: this.getMinutesFromItem(item)
      }));
      items.forEach(item => (reached.minutes += item.minutes));
      dayData.reached = reached;
    }
    return doc.setData(data);
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
    return await this.documentService.getOrCreateDocument<Month>({
      path: `userData/${user}/months`,
      name: month,
      defaultData: createDefaultDataForMonth(month)
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
