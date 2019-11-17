import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustDayTargetDialogComponent } from './adjust-day-target-dialog.component';

describe('AdjustDayTargetDialogComponent', () => {
  let component: AdjustDayTargetDialogComponent;
  let fixture: ComponentFixture<AdjustDayTargetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustDayTargetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustDayTargetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
