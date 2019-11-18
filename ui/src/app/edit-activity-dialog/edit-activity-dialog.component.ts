import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ItemDTO } from '../item';
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
export namespace EditActivityDialogComponent {
  export type Data = { activity: ItemDTO };
}

@Component({
  selector: 'app-edit-activity-dialog',
  templateUrl: './edit-activity-dialog.component.html',
  styleUrls: ['./edit-activity-dialog.component.scss']
})
export class EditActivityDialogComponent implements OnInit {
  constructor(
    private readonly ref: MatDialogRef<EditActivityDialogComponent, ItemDTO>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: EditActivityDialogComponent.Data
  ) {}

  form = new ItemForm();

  ngOnInit() {
    const item = this.data.activity;

    this.form.patchValue({
      uid: item.uid,
      title: item.title,
      category: item.category,
      date: item.date,
      start: item.start,
      end: item.end
    });
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.getValue());
    }
  }
}
