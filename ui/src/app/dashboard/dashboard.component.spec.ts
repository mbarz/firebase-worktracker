import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Day } from '../days.service';
import { MaterialModule } from '../material/material.module';
import { Month } from '../months.service';
import { DashboardComponent } from './dashboard.component';
import { initialState } from './../reducers';

@Component({ selector: 'app-day-card', template: `` })
class DayCardStubComponent {
  @Input() day!: Day;
}

@Component({ selector: 'app-month-card', template: `` })
class MonthCardStubComponent {
  @Input() month!: Month;
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule, RouterModule],
      providers: [provideMockStore({ initialState })],
      declarations: [
        DashboardComponent,
        DayCardStubComponent,
        MonthCardStubComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
