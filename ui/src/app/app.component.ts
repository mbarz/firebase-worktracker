import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firebase-worktracker-ui';
  constructor(
    public afAuth: AngularFireAuth,
    private readonly router: Router
  ) {}

  logout() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
