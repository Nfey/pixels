import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user;
  isLoggedIn: Boolean;
  constructor(private _auth: AuthService, private _api: ApiService) { }

  ngOnInit() {
    this.isLoggedIn = this._auth.isLoggedIn();
    if (this.isLoggedIn){
      this._api.getUserWithToken().subscribe(user => {
        this.user = user;
      });
    }
  }
}
