export type Month = {
  uid: string;
  days: {
    uid: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[];
  categories: { uid: string; tracked: { minutes: number } }[];
};
