import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  serverError;
  user: { email: String, password: String } = { email: "", password: "" }
  constructor(private _auth: AuthService, private _router: Router) { }
  login() {
    console.log(this.user);
    this._auth.login(this.user.email, this.user.password).subscribe(result => {
      this.user = { email: "", password: "" };
      this._router.navigate(['/']);
    }, err => {
      this.serverError = "Invalid Email-Password Combination."
    });
  }
}
