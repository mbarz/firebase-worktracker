import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { DaysService } from '../days.service';
import { DurationPipe } from '../duration.pipe';
import { MaterialModule } from '../material/material.module';
import { Month } from '../months.service';
import { State } from '../reducers';
import { MonthCardComponent } from './month-card.component';

describe('MonthCardComponent', () => {
  let component: MonthCardComponent;
  let fixture: ComponentFixture<MonthCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule, RouterModule],
      providers: [
        provideMockStore<State>({
          initialState: { app: { summary: { trackedMonths: [] } }, auth: {} }
        }),
        { provide: DaysService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ],
      declarations: [MonthCardComponent, DurationPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthCardComponent);
    component = fixture.componentInstance;
    component.month = new Month({ uid: '2019-10', categories: [], days: [] });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
