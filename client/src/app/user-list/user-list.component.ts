import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users;
  loggedInUser;
  constructor(private _api: ApiService, private _auth: AuthService) { }
  ngOnInit() {
    if (this._auth.isLoggedIn()){
      console.log("logged in")
      this._api.getUserWithToken().subscribe(user => {
        this.loggedInUser = user;
        console.log(this.loggedInUser);
        this._api.getUsers().subscribe(users => {
          this.users = users;
          console.log(this.users);
        });
      });
    }
  }
  deleteUser(id){
    this._api.deleteUser(id).subscribe(result => {
      this._api.getUsers().subscribe(users => this.users = users);
    });
  }
}
