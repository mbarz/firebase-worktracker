import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  openActivityCreationDialog,
  deleteActivity,
  openActivityEditDialog
} from '../actions';
import { Day } from '../days.service';
import { Item } from '../item';

@Component({
  selector: 'app-day-card',
  templateUrl: './day-card.component.html',
  styleUrls: ['./day-card.component.scss']
})
export class DayCardComponent implements OnInit {
  @Input() day?: Day;

  displayedItemColumns = ['actions', 'title', 'category', 'time'];

  constructor(private readonly store: Store<any>) {}

  ngOnInit() {}

  createItem() {
    const day = { day: this.day ? this.day.uid : undefined };
    this.store.dispatch(openActivityCreationDialog(day));
  }

  editItem(item: Item) {
    this.store.dispatch(openActivityEditDialog({ activity: item.dto }));
  }

  deleteItem(item: Item) {
    this.store.dispatch(deleteActivity({ activity: item.dto }));
  }
}
