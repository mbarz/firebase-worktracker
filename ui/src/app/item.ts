export type ItemDTO = {
  uid: string;
  title: string;
  user: string;
  category: string;
  start: string;
  end: string;
};

export class Item {
  end: Date;
  start: Date;
  uid: string;
  title: string;
  user: string;
  category: string;
  constructor(data: ItemDTO) {
    this.uid = data.uid;
    this.title = data.title;
    this.user = data.user;
    this.category = data.category;
    this.start = new Date(data.start);
    this.end = new Date(data.end);
  }
  get duration() {
    const milliseconds = this.end.getTime() - this.start.getTime();
    return { milliseconds };
  }
}
