import { ItemDocumentData } from './item';

export type DayDocumentData = {
  items: ItemDocumentData[];
  day: string;
  user: string;
};
