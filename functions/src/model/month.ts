export type CategoryTrackingSummary = {
  uid: string;
  tracked: {
    minutes: number;
  };
};

export type Month = {
  uid: string;
  days: {
    uid: string;
    target: { minutes: number };
    reached: { minutes: number };
  }[];
  categories: CategoryTrackingSummary[];
};
