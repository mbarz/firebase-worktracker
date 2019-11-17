import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NEVER, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DaysService } from '../days.service';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items$: Observable<any> = NEVER;
  days$: Observable<any> = NEVER;

  user$ = this.auth.user.pipe(switchMap(user => (user ? of(user) : NEVER)));

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly itemsService: ItemsService,
    private readonly daysService: DaysService
  ) {}

  ngOnInit() {
    this.items$ = this.itemsService.getItems();
    this.days$ = this.daysService.getDays();
  }

  delete(item: any) {
    return this.itemsService.deleteItem(item).subscribe();
  }
}
