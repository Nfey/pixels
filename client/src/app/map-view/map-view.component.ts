import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { interval } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
  map;
  colors = ['red','blue','green', 'white']
  color = "green";
  newPixel: { map_pos: { map: any, x: Number, y: Number }, color: String, heat: Number, effect: String, strength: Number } = { map_pos: { map: 0, x: 0, y: 0 }, color: "white", heat: 0, effect: "none", strength: 1 }
  pixelGrid = [];
  claimUpdateSubscription;
  constructor(private _api: ApiService, private _route: ActivatedRoute, private _sockets: SocketService) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this._api.getMapById(params.id).subscribe(map => {
        this.map = map;
        this.newPixel.map_pos.map = map['_id'];
        console.log(map['_id']);
        this._api.getPixelsFromMapId(map['_id']).subscribe(pixels => {
          this.map.pixels = pixels;
          for (let y = 0; y < this.map.height; y++) {
            this.pixelGrid[y] = []
            for (let x = 0; x < this.map.width; x++) {
              this.pixelGrid[y].push(map['pixels'][x + (this.map.width * y)])
            }
          }
          // console.log(this.pixelGrid);
        });
        const claimUpdate$ = this._sockets.getClaimUpdates();
        this.claimUpdateSubscription = claimUpdate$.subscribe(pixel => {
          console.log(pixel);
          this.pixelGrid[pixel['map_pos'].y][pixel['map_pos'].x] = pixel;
        });
        
      });
    });
  }
  onSubmit() {
    this._api.createPixel(this.newPixel).subscribe(pixel => {
      this.newPixel = { map_pos: { map: this.map['_id'], x: 0, y: 0 }, color: "white", heat: 0, effect: "none", strength: 1 }
    });
  }
  claimPixel(pixel){
    pixel.color = this.color;
    this._api.claimPixel(pixel).subscribe();
  }
  setColor(color){
    this.color = color;
  }
  ngOnDestroy(){
    this.claimUpdateSubscription.unsubscribe();
  }
  
}
