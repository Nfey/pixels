import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {
  maps: Object;
  constructor(private _api: ApiService) { }

  ngOnInit(): void {
    this._api.getMaps().subscribe(maps => {
      this.maps = maps;
    });
  }
  removeMap(map){
    this._api.removeMap(map._id).subscribe(() => {
      this._api.getMaps().subscribe(maps => {
        this.maps = maps;
      });
    });
  }

}
