import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {
  maps: Object;
  user: Object;
  constructor(private _api: ApiService) { }

  ngOnInit(): void {
    this._api.getMaps().subscribe(maps => {
      this.maps = maps;
    });
    this._api.getUserWithToken().subscribe(user => {
      this.user = user;
    })
  }
  removeMap(map){
    this._api.removeMap(map._id).subscribe(() => {
      this._api.getMaps().subscribe(maps => {
        this.maps = maps;
      });
    });
  }
  joinMap(map){
    this._api.joinMap(map).subscribe(user_map => {
      console.log(user_map);
      this._api.getMaps().subscribe(maps => {
        this.maps = maps;
      });
    })
  }

}
