import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatIconModule, MatInputModule, MatNativeDateModule, MatProgressBarModule } from '@angular/material';

const MODULES = [
  MatInputModule,
  MatButtonModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCardModule,
  MatIconModule,
  MatProgressBarModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialModule {}
