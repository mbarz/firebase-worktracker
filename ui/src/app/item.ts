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
  constructor(public readonly dto: ItemDTO) {
    this.uid = dto.uid;
    this.title = dto.title;
    this.category = dto.category;

    this.start = new Date(`${dto.date} ${dto.start}`);
    this.end = new Date(`${dto.date} ${dto.end}`);
  }
  get duration() {
    const milliseconds = this.end.getTime() - this.start.getTime();
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return { milliseconds, minutes };
  }
}
