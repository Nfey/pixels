import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  observer: Observer<any>;
  socket;
  constructor() { }

  getClaimUpdates() {
    this.socket.on('pixelClaimed', pixel => {
      return this.observer.next(pixel);
    });
    return this.createObservable();
  }
  joinRoom(id) {
    this.socket = io('http://localhost:8000/');
    this.socket.emit('join-room', id);
    // this.socket.on('joined', _=> {
    //   console.log('room joined');
    // });
  }
  leaveRoom(){
    this.socket.emit('leave-room');
  }


  createObservable() {
    return new Observable(observer => this.observer = observer);
  }
}
