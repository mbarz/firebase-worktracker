import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth as fireAuth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly router: Router
  ) {}

  loginMethods = [
    {
      text: 'Github',
      key: 'github',
      icon: 'fa-github',
      fn: () => this.loginWith(new fireAuth.GithubAuthProvider())
    },
    {
      text: 'Facebook',
      key: 'facebook',
      icon: 'fa-facebook',
      fn: () => this.loginWith(new fireAuth.FacebookAuthProvider())
    }
  ];

  ngOnInit() {}

  loginWith(provider: fireAuth.AuthProvider) {
    this.auth.auth
      .signInWithPopup(provider)
      .then(() => this.router.navigate(['/']));
  }
}
