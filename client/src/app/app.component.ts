import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  loggedIn;
  constructor(public _auth: AuthService, private _router: Router, private _socket: SocketService){}
  ngOnInit(){
    this.loggedIn = this._auth.isLoggedIn();
    this._socket.connect();
  }
  logout(){
    this._auth.logout().subscribe(res => {
      this.loggedIn = this._auth.isLoggedIn();
      this._router.navigate(['/login']);
    });
  }
}
