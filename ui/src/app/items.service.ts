import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { ItemDTO } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly firestore: AngularFirestore
  ) {}

  getItems(): Observable<ItemDTO[]> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => (user ? this.getItemsForUser(user) : of([])))
    );
  }

  getItemsForUser(user: firebase.User): Observable<ItemDTO[]> {
    return this.collection(user.uid).valueChanges();
  }

  createItem(item: ItemDTO) {
    return this.auth.user.pipe(
      map(user => {
        if (!user) {
          throw new Error('Must be logged in to create item');
        }
        console.log(`creating item as ${user.uid}`);
        const doc = this.collection(user.uid).doc(item.uid);
        return doc.set(item, { merge: false });
      })
    );
  }

  private collection(user: string) {
    return this.firestore.collection<ItemDTO>(`userData/${user}/items`);
  }

  deleteItem(item: ItemDTO) {
    return this.auth.user.pipe(
      map(user => {
        if (!user) {
          throw new Error('Must be logged in to delete item');
        }
        const doc = this.collection(user.uid).doc(item.uid);
        return doc.delete();
      })
    );
  }
}
