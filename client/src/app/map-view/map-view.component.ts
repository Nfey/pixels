import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { interval } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
  map;
  name;
  user;
  colors = ['red', 'blue', 'green', 'white']
  color = "green";
  newPixel: { map_pos: { map: any, x: Number, y: Number }, color: String, heat: Number, effect: String, strength: Number } = { map_pos: { map: 0, x: 0, y: 0 }, color: "white", heat: 0, effect: "none", strength: 1 }
  pixelGrid = [];
  claimUpdateSubscription;
  selectedUser;
  constructor(private _api: ApiService, private _route: ActivatedRoute, private _sockets: SocketService, private _auth: AuthService) { }

  ngOnInit(): void {
    // TODO: Clean up this mess of subscriptions
    this._auth.getUserObject().subscribe(user => {
      this.user = user;
    });
    this._route.params.subscribe(params => {
      // TODO: Display 404 message if map does not exist in database
      this._sockets.joinRoom(params.id);
      this._api.getMapById(params.id).subscribe(map => {
        this.map = map;
        this.newPixel.map_pos.map = map['_id'];
        this._api.getPixelsFromMapId(map['_id']).subscribe(pixels => {
          this.map.pixels = pixels;
          for (let y = 0; y < this.map.height; y++) {
            this.pixelGrid[y] = []
            for (let x = 0; x < this.map.width; x++) {
              this.pixelGrid[y].push(map['pixels'][x + (this.map.width * y)])
            }
          }
          console.log(this.map);
        });
        const claimUpdate$ = this._sockets.getClaimUpdates();
        this.claimUpdateSubscription = claimUpdate$.subscribe(
          pixel => {
            console.log(pixel);
            this.pixelGrid[pixel['map_pos'].y][pixel['map_pos'].x] = pixel;
          },
          error => {
            // console.log(error);
          }
        );
        const initialTurnUpdate$ = this._sockets.getInitialTurnUpdates();
        initialTurnUpdate$.subscribe(data => {
          var y = data['pixel']['map_pos'].y;
          var x = data['pixel']['map_pos'].x;
          this.pixelGrid[y][x] = data['pixel'];
          this.map.phase = data['map_phase'];
          this.map.users = data['playerList'];
        })
      });
    });
  }
  pixelClicked(pixel){
    console.log("clicked on pixel:", pixel);
    console.log("phase:", this.map.phase);
    if (this.map.phase === "turn"){
      this.takeInitialTurn(pixel);
    }
    else {
      this.claimPixel(pixel);
    }
  }
  claimPixel(pixel) {
    var pixelCopy = Object.assign({}, pixel);
    pixelCopy.color = this.color;
    delete pixelCopy.hover;
    this._api.claimPixel(pixelCopy).subscribe();
  }
  takeInitialTurn(pixel){
    var pixelCopy = Object.assign({}, pixel);
    pixelCopy.color = this.color;
    delete pixelCopy.hover;
    console.log("body info:", pixelCopy._id, this.map._id, pixelCopy.color)
    this._api.takeInitialTurn(pixelCopy._id, this.map._id, pixelCopy.color).subscribe(map => {
    },
    error => {
      console.log(error);
    });
  }
  setColor(color) {
    this.color = color;
  }
  ngOnDestroy() {
    if (this.claimUpdateSubscription) {
      this.claimUpdateSubscription.unsubscribe();
      this._sockets.leaveRoom();
    }
  }
  highlightByUser(user){
    this.selectedUser = user;
  }
  deselectPixels(){
    this.selectedUser = undefined;
  }
}
