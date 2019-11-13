import { Item } from '../model';
import * as faker from 'faker';

export function createFakeItem(data: Partial<Item> = {}): Item {
  let date = data.date || '';
  let start = data.start || '';
  let end = data.end || '';
  if (!date) {
    date = faker.date
      .recent(10)
      .toISOString()
      .substring(0, 10);
  }
  if (!start) {
    const h = faker.random.number({ min: 0, max: 23 });
    start = `${h.toString().padStart(2, '0')}:00`;
  }
  if (!end) {
    let h = parseInt(start.split(':')[0] + 1);
    if (h >= 24) {
      h -= 24;
    }
    end = `${h.toString().padStart(2, '0')}:00`;
  }

  return {
    date,
    start,
    end,
    uid: faker.random.uuid(),
    category: faker.finance.accountName(),
    title: faker.hacker.noun(),
    ...data
  };
}
