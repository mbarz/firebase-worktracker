import { Component, OnInit } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { DaysService } from '../days.service';
import { ItemDTO } from '../item';
import { ItemsService } from '../items.service';
import { SummaryService } from '../summary.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDay$: Observable<any> = NEVER;
  summary$: Observable<any> = NEVER;

  constructor(
    private readonly daysService: DaysService,
    private readonly itemsService: ItemsService,
    private readonly summaryService: SummaryService
  ) {}

  ngOnInit() {
    const date = new Date();
    const iso = date.toISOString().substring(0, 10);
    this.currentDay$ = this.daysService.getDay(iso);
    this.summary$ = this.summaryService.getSummary();
  }

  deleteItem(item: ItemDTO) {
    this.itemsService.deleteItem(item).subscribe();
  }
}
