import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../material/material.module';
import { Month, MonthsService } from '../months.service';
import { MonthPageComponent } from './month-page.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from './../reducers';

@Component({ selector: 'app-month-card', template: `` })
class MonthCardStubComponent {
  @Input() month!: Month;
}

describe('MonthPageComponent', () => {
  let component: MonthPageComponent;
  let fixture: ComponentFixture<MonthPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule, NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: MonthsService, useValue: {} }
      ],
      declarations: [MonthPageComponent, MonthCardStubComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
