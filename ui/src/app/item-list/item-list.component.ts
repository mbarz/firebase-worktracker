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

    const d = value.date.getDate();
    const m = value.date.getMonth();
    const y = value.date.getFullYear();
    const date = [
      y.toString().padStart(4, '0'),
      m.toString().padStart(2, '0'),
      d.toString().padStart(2, '0')
    ].join('-');

    const item: ItemDTO = {
      uid: shortid.generate(),
      title: value.title,
      category: value.category,
      date,
      start: value.start,
      end: value.end
    };
    return this.itemsService.createItem(item).subscribe();
  }

  delete(item: any) {
    return this.itemsService.deleteItem(item).subscribe();
  }

  private patchFormValue(value: Partial<FormValue>) {
    this.formGroup.patchValue(value);
  }

  private getFormValue(): FormValue {
    return this.formGroup.value;
  }
}
