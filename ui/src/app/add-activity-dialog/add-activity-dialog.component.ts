import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as shortid from 'shortid';
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
export namespace AddActivityDialogComponent {
  export type Data = { day?: string };
}

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html',
  styleUrls: ['./add-activity-dialog.component.scss']
})
export class AddActivityDialogComponent implements OnInit {
  constructor(
    private ref: MatDialogRef<AddActivityDialogComponent, ItemDTO>,
    @Inject(MAT_DIALOG_DATA) private data: AddActivityDialogComponent.Data
  ) {}

  form = new ItemForm();

  ngOnInit() {
    const now = new Date();
    const initialDate = new Date(now);
    initialDate.setHours(12, 0, 0, 0);
    this.form.patchValue({
      uid: shortid.generate(),
      date: this.data.day || initialDate.toISOString().substring(0, 10),
      start: `${now.getHours() - 1}:00`,
      end: `${now.getHours()}:00`
    });
  }

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.getValue());
    }
  }
}
