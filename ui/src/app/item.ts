export type ItemDTO = {
  uid: string;
  title: string;
  category: string;
  date: string;
  start: string;
  end: string;
};

export class Item {
  uid: string;
  title: string;
  category: string;
  start: Date;
  end: Date;
  constructor(data: ItemDTO) {
    this.uid = data.uid;
    this.title = data.title;
    this.category = data.category;

    this.start = new Date(`${data.date} ${data.start}`);
    this.end = new Date(`${data.date} ${data.end}`);
  }
  get duration() {
    const milliseconds = this.end.getTime() - this.start.getTime();
    return { milliseconds };
  }
}
