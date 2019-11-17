import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// tslint:disable-next-line:no-namespace
export namespace AdjustDayTargetDialogComponent {
  export type Data = {
    day: { target: { minutes: number } };
  };
}

@Component({
  selector: 'app-adjust-day-target-dialog',
  templateUrl: './adjust-day-target-dialog.component.html',
  styleUrls: ['./adjust-day-target-dialog.component.scss']
})
export class AdjustDayTargetDialogComponent implements OnInit {
  target = { minutes: 0 };

  constructor(
    private ref: MatDialogRef<
      AdjustDayTargetDialogComponent,
      { minutes: number }
    >,
    @Inject(MAT_DIALOG_DATA) private data: AdjustDayTargetDialogComponent.Data
  ) {}

  ngOnInit() {
    this.target = { minutes: this.data.day.target.minutes };
  }

  submit() {
    this.ref.close(this.target);
  }
}
