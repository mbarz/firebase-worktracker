import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NEVER, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import * as shortid from 'shortid';
import { DaysService } from '../days.service';
import { ItemDTO } from '../item';
import { ItemsService } from '../items.service';

type FormValue = {
  title: string;
  date: Date;
  start: string;
  end: string;
  user: string;
  category: string;
};

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  formGroup = new FormGroup({
    title: new FormControl(undefined, [Validators.required]),
    date: new FormControl(undefined, [Validators.required]),
    start: new FormControl(undefined, [Validators.required]),
    end: new FormControl(undefined, [Validators.required]),
    user: new FormControl(undefined, [Validators.required]),
    category: new FormControl(undefined, [Validators.required])
  });

  items$: Observable<any> = NEVER;
  days$: Observable<any> = NEVER;

  user$ = this.auth.user.pipe(switchMap(user => (user ? of(user) : NEVER)));

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly itemsService: ItemsService,
    private readonly daysService: DaysService
  ) {}

  ngOnInit() {
    this.user$.pipe(take(1)).subscribe(user => {
      const now = new Date();
      const initialDate = new Date(now);
      initialDate.setHours(0, 0, 0, 0);
      this.patchFormValue({
        user: user.uid,
        date: initialDate,
        start: `${now.getHours() - 1}:00`,
        end: `${now.getHours()}:00`
      });
    });
    this.items$ = this.itemsService.getItems();
    this.days$ = this.daysService.getDays();
  }

  onSubmit() {
    const value = this.getFormValue();
    const start = new Date(value.date);
    const end = new Date(value.date);
    start.setHours(...this.parseTime(value.start));
    end.setHours(...this.parseTime(value.end));
    const item: ItemDTO = {
      uid: shortid.generate(),
      title: value.title,
      category: value.category,
      user: value.user,
      start: start.toISOString(),
      end: end.toISOString()
    };
    return this.itemsService.createItem(item);
  }

  delete(item: any) {
    return this.itemsService.deleteItem(item);
  }

  private parseTime(time: string): [number, number, number, number] {
    const arr = time.split(':').map(s => parseInt(s, 10));
    return [arr[0], arr[1], 0, 0];
  }

  private patchFormValue(value: Partial<FormValue>) {
    this.formGroup.patchValue(value);
  }

  private getFormValue(): FormValue {
    return this.formGroup.value;
  }
}
