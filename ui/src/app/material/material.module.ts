import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

const MODULES = [
  MatInputModule,
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTableModule,
  MatChipsModule,
  MatMenuModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule {}
