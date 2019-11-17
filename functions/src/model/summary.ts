export type MonthTrackingSummary = {
  uid: string;
  balance: {
    minutes: number;
  };
};

export type Summary = {
  balance: { minutes: number };
  trackedMonths: MonthTrackingSummary[];
};
