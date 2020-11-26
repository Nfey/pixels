import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(public _auth: AuthService, private _router: Router){}

  ngOnInit(){}

  logout(){
    this._auth.logout().subscribe(res => {
      this._router.navigate(['/login']);
    });
  }
}
