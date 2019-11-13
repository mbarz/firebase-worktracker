export type Summary = {
  balance: { minutes: number };
  trackedMonths: { uid: string; balance: { minutes: number } }[];
};
