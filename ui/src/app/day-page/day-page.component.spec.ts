import { Component, Input } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NEVER } from 'rxjs';
import { Day, DaysService } from '../days.service';
import { MaterialModule } from '../material/material.module';
import { initialState, State } from '../reducers';
import { DayPageComponent } from './day-page.component';

@Component({ selector: 'app-day-card', template: `` })
class DayCardStubComponent {
  @Input() day!: Day;
}

describe('DayPageComponent', () => {
  let component: DayPageComponent;
  let fixture: ComponentFixture<DayPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule, NoopAnimationsModule],
      providers: [
        provideMockStore<State>({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: { params: NEVER }
        },
        { provide: DaysService, useValue: {} }
      ],
      declarations: [DayPageComponent, DayCardStubComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
});
