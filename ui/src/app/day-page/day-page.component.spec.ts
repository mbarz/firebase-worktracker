import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Day, DaysService } from '../days.service';
import { MaterialModule } from '../material/material.module';
import { DayPageComponent } from './day-page.component';
import { of } from 'rxjs';

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
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: { params: of({ day: '2019-10-10' }) }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
