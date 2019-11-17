import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressBarModule
} from '@angular/material';

const MODULES = [
  MatInputModule,
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatDialogModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule {}
