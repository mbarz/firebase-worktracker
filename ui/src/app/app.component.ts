import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from './reducers';
import * as fromApp from './selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user$ = this.store.select(fromApp.getUser);
  balance$ = this.store.select(fromApp.getBalance);

  constructor(
    public afAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly store: Store<State>
  ) {}

  logout() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
