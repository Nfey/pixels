import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-active-matches',
  templateUrl: './active-matches.component.html',
  styleUrls: ['./active-matches.component.css']
})
export class ActiveMatchesComponent implements OnInit {
  user;
  maps;
  constructor(private _api: ApiService) { }

  ngOnInit(): void {
    this._api.getUserWithToken().subscribe(user => {
      this.user = user;
      this._api.getMaps().subscribe((maps: Array<Object>) => {
        this.maps = maps.filter(map => map['users'].includes(this.user._id));
      });
    })
  }

}
