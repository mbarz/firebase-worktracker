import { Item } from './item';

export type Day = {
  uid: string;
  items: Item[];
  target: { minutes: number };
};
