import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-new-map',
  templateUrl: './new-map.component.html',
  styleUrls: ['./new-map.component.css']
})
export class NewMapComponent implements OnInit {
  map: {theme: String, height: Number, width: Number} = {theme: "", height: 5, width: 5};
  constructor(private _api: ApiService, private _router: Router) { }

  ngOnInit(): void {
    
  }
  onSubmit(){
    this._api.addMap(this.map).subscribe(() => {
      this.map = {theme: "", height: 5, width: 5};
      this._router.navigate(['/maps']);
    });
  }

}
