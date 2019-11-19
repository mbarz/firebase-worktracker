import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as shortid from 'shortid';
import { ItemDTO } from '../item';
import { Day } from '../days.service';
import { StoredDay } from '../reducers';
class ItemForm {
  group = new FormGroup({
    uid: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    date: new FormControl(0, Validators.required),
    start: new FormControl(0, Validators.required),
    end: new FormControl(0, Validators.required)
  });
  constructor() {}

  getValue(): ItemDTO {
    const d = new Date(this.group.value.date);
    d.setHours(12);
    const date = d.toISOString().substring(0, 10);
    return { ...this.group.value, date };
  }

  patchValue(value: Partial<ItemDTO>) {
    this.group.patchValue(value);
  }

  get valid() {
    return this.group.valid;
  }
}

// tslint:disable-next-line:no-namespace
export namespace AddActivityDialogComponent {
  export type Data = { day?: StoredDay | string };
}

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html',
  styleUrls: ['./add-activity-dialog.component.scss']
})
export class AddActivityDialogComponent implements OnInit {
  constructor(
    private readonly ref: MatDialogRef<AddActivityDialogComponent, ItemDTO>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: AddActivityDialogComponent.Data
  ) {}

  form = new ItemForm();

  ngOnInit() {
    const now = new Date();
    const initialDate = new Date(now);
    initialDate.setHours(12, 0, 0, 0);
    const uid = shortid.generate();
    const date = this.data.day
      ? typeof this.data.day === 'string'
        ? this.data.day
        : this.data.day.uid
      : initialDate.toISOString().substring(0, 10);

    let start = this.formatTime(now.getHours(), 0);
    if (this.data.day && typeof this.data.day !== 'string') {
      const items = [...this.data.day.items];
      items.sort((a, b) => a.end.localeCompare(b.end));
      const last = items.pop();
      if (last) {
        start = last.end;
      }
    }

    const parsedStart = this.parseTime(start);
    const end = this.formatTime(parsedStart.h + 1, parsedStart.m);
    this.form.patchValue({ uid, date, start, end });
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.getValue());
    }
  }

  formatTime(hours: number, minutes: number) {
    return [hours, minutes].map(n => n.toString().padStart(2, '0')).join(':');
  }
  parseTime(t: string): { h: number; m: number } {
    const [h, m] = t.split(':').map(s => parseInt(s, 10));
    return { h, m };
  }
}
