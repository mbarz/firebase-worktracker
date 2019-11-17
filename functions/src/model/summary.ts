export type MonthTrackingSummary = {
  uid: string;
  balance: {
    minutes: number;
  };
};

export type Summary = {
  trackedMonths: MonthTrackingSummary[];
};
