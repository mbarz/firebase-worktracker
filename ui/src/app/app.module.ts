import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { EditActivityDialogComponent } from './edit-activity-dialog/edit-activity-dialog.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { DayCardComponent } from './day-card/day-card.component';
import { MonthCardComponent } from './month-card/month-card.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    LoginComponent,
    DashboardComponent,
    DurationPipe,
    AddActivityDialogComponent,
    AdjustDayTargetDialogComponent,
    EditActivityDialogComponent,
    DayCardComponent,
    MonthCardComponent
  ],
  entryComponents: [
    AddActivityDialogComponent,
    EditActivityDialogComponent,
    AdjustDayTargetDialogComponent
  ],
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
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
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
