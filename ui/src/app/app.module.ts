import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { DurationPipe } from './duration.pipe';
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import { AddActivityDialogComponent } from './add-activity-dialog/add-activity-dialog.component';
import { AdjustDayTargetDialogComponent } from './adjust-day-target-dialog/adjust-day-target-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    LoginComponent,
    DashboardComponent,
    DurationPipe,
    AddActivityDialogComponent,
    AdjustDayTargetDialogComponent
  ],
  entryComponents: [AddActivityDialogComponent, AdjustDayTargetDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: FirestoreSettingsToken,
      useValue: environment.production
        ? undefined
        : { host: 'localhost:8888', ssl: false }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
